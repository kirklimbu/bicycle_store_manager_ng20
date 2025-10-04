import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, of, switchMap, tap } from 'rxjs';
import { AuthStateModel } from 'src/app/domains/shared/util-auth/models/auth.model';
import { AuthService } from 'src/app/domains/shared/util-auth/services/auth-http/auth.service';
import { Role, UserModel } from '../../../shared/util-auth/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private readonly authService = inject(AuthService);

  private state = signal<AuthStateModel>({
    user: null,
    token: null,
  });

  // UI state managed separately
  private uiState = signal({
    isLoading: false,
    error: null as string | null,
  });

  // // Computed selectors
  user = computed(() => this.state().user);
  token = computed(() => this.state().token);

  // UI state computed
  isLoading = computed(() => this.uiState().isLoading);
  error = computed(() => this.uiState().error);
  isAuthenticated = computed(() => !!this.state().token);

  // Role-based computed properties
  userRole = computed(() => this.state().user?.role || Role.NONE);
  userRoles = computed(() => [this.state().user?.role || Role.NONE]);
  isAdmin = computed(() => this.userRole() === Role.ADMIN);

  constructor() {
    this.initializeFromStorage();
  }

  hasAnyRole(requiredRoles: Role[]): boolean {
    // If no roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const currentRole = this.userRole();

    // Check if current role is in the required roles array
    return requiredRoles.includes(currentRole);
  }

  private initializeFromStorage() {
    const savedAuth = localStorage.getItem('Auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        this.state.set({
          user: authData.user,
          token: authData.token,
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.authService
      .login(credentials.username, credentials.password)
      .pipe(
        tap((result) => {
          console.log('login state res', result);
          this.setAuth(result);
        }),
        switchMap((result) => {
          return of({ user: result });
        }),

        finalize(() => {
          this.setLoading(false);
        })
      );
  }

  // PROPER LOGOUT - Returns observable for proper chaining
  logout() {
    const userId = this.user()?.userId;
    console.log('userId', userId);

    if (userId) {
      this.setLoading(true);

      return this.authService.logout(userId).pipe(
        tap(() => {
          this.clearAuth();
        })
      );
    } else {
      this.clearAuth();
      return of(null); // Return observable for consistency
    }
  }

  // BONUS: Refresh token with proper RxJS

  // Private methods remain the same
  private setAuth(authData: any) {
    const user = new UserModel({
      token: authData.token,
      roleId: authData.roleId,
      id: authData.id,
      userId: authData.userId,
      name: authData.name,
      role: authData.role,
      mobile: authData.mobile || '',
      addressOne: authData.addressOne || '',
      addressTwo: authData.addressTwo || '',
      email: authData.email || '',
      attUserId: authData.attUserId || 0,
      isLoading: false,
      error: null,
    });

    this.state.set({
      user,
      token: authData.token, // ✅ Always exists
    });

    this.saveToStorage({ user, token: authData.token });
  }
  private setLoading(loading: boolean) {
    this.state.update((s) => ({ ...s, isLoading: loading }));
  }

  private clearAuth() {
    this.state.set({
      user: null,
      token: null,
    });
    this.clearStorage();
  }

  private saveToStorage(authData: { user: UserModel; token: string }) {
    const storage = localStorage;
    storage.setItem('Auth', JSON.stringify(authData));
  }

  private clearStorage() {
    localStorage.removeItem('Auth');
    sessionStorage.removeItem('Auth');
  }
}
