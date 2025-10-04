import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  isAuthenticated$: Observable<boolean> | undefined;

  // getUserStatus(): Observable<boolean> {
  //   return (this.isAuthenticated$ = this.store.select(
  //     AuthState.isAuthenticated
  //   ));
  // }

  // getUserId() {
  //   const userDetail = this.store.selectSnapshot(AuthState.userDetails);
  //   if (
  //     userDetail.userId == 'null' ||
  //     userDetail.userId == 'undefined' ||
  //     userDetail.userId == undefined
  //   ) {
  //     return '0';
  //   }
  //   return userDetail.userId;
  // }

  // getUserRole(): Role {
  //   const user = this.store.selectSnapshot(AuthState.userDetails);
  //   return user.role;
  // }

  // getUserDetails(): UserModel {
  //   const user = this.store.selectSnapshot(AuthState.userDetails);
  //   return user;
  // }
}
