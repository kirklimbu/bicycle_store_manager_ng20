import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/domains/user-profile/data/model/user-profile.model';
import { environment } from '../../../../../../environments/environment';
import { ICustomResponse } from '../../../models/CustomResponse.model';
import { ILoginResponseDto, UserModel } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSignal = signal<UserModel | undefined>(undefined);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Getter/setter for current user
  get currentUser() {
    return this.currentUserSignal();
  }

  set currentUser(user: UserModel | undefined) {
    this.currentUserSignal.set(user);
  }

  login(username: string, password: string): Observable<ILoginResponseDto> {
    return this.http.post<ILoginResponseDto>(`${this.apiUrl}user/login`, {
      username,
      password,
    });
  }

  logout(userId: number): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}user/logout?userId=${userId}`,
      {}
    );
  }

  registration(user: UserModel): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}user/registration/save`,
      user
    );
  }

  forgetPassword(password: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/user/password/change/save`,
      password
    );
  }

  private clearAuthData(): void {
    this.currentUser = undefined;
    localStorage.removeItem('authData');
  }

  private refreshPage(): void {
    const currentRoute = this.router.url;
    const [url, query] = currentRoute.split('?');
    const id = query?.split('=')[1];

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url], id ? { queryParams: { id } } : undefined);
    });
  }

  getUserProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}auth/user/profile`);
  }
}
