import { Routes } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

export const FEATURE_AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: '',
    data: {
      breadcrumb: {
        label: 'admin',
      },
    },

    component: AdminComponent,
    loadChildren: () =>
      import('.././admin').then((m) => m.FEATURE_ADMIN_ROUTES),
  },
];
