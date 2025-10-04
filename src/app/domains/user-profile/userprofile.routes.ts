
import { Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileAddComponent } from './user-profile-add/user-profile-add.component';

export const FEATURE_USER_ROUTES: Routes = [
    {
        path: 'user-profile',
        component: UserProfileComponent,
    },

];
