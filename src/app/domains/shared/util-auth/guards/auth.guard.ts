import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '../../../../domains/auth/login/state/login.state';
// import { Store } from '@ngxs/store';
// import { AuthState } from 'src/app/domains/auth/login/state/login.state';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private router = inject(Router);
  private readonly authState = inject(AuthState);

  canActivate() {
    // const isAuthenticated = this.store.selectSnapshot(
    //   AuthState.isAuthenticated
    // );
    const isAuthenticated = this.authState.isAuthenticated;
    console.log('auth guard isAuthenticated', isAuthenticated());

    if (!isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
