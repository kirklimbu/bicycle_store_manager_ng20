import { Routes } from '@angular/router';
import { Role } from '../shared/util-auth/models/user.model';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { AuthGuard } from '../shared/util-auth/guards/auth.guard';

export const FEATURE_ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('.././user-profile').then((m) => m.FEATURE_USER_ROUTES),
  // },

  // {
  //   canActivate: [hasRoleGuard],
  //   data: {
  //     roles: [Role.ADMIN],
  //   },
  //   path: 'dashboard',
  //   component: DashboardComponent,
  // },

  {
    // canActivate: [hasRoleGuard],
    // data: {
    //   roles: [Role.USER, Role.ADMIN],
    // },
    path: 'user-profile',
    component: UserProfileComponent,
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../company/').then((m) => m.FEATURE_COMPANY_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../customer/').then((m) => m.FEATURE_CUSTOMER_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../sales').then((m) => m.FEATURE_SALES_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../stock').then((m) => m.FEATURE_STOCK_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../category').then((m) => m.FEATURE_CATEGORY_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../order').then((m) => m.FEATURE_ORDER_ROUTES),
  },{
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../dayend').then((m) => m.FEATURE_DAYEND_ROUTES),
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
