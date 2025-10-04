// import { Customer } from './../customer/data/models/customer';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthState } from '../auth/login/state/login.state';
// third-party
// import { ChipsModule } from 'primeng/chips';
// import { ChipModule } from 'primeng/chip';
// import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthService } from '../shared/util-auth/services/auth-http/auth.service';
import { Observable } from 'rxjs';
import { IUser } from './data/model/user-profile.model';
// import { customer } from '../customer/customer-details-add/customer-details-add.component';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NzSpinModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  user$: Observable<IUser>;
  private router = inject(Router);
  private readonly authService = inject(AuthService);

  constructor() {
    this.fetchUserDetails();
  }

  private fetchUserDetails() {
    // this.userId = this.store.selectSnapshot(AuthState.userDetails).userId;
    this.user$ = this.authService.getUserProfile();
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
