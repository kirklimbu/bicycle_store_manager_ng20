import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/util-auth/guards/auth.guard';
import { UserProfileComponent } from '../user-profile/user-profile.component';

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
  }, {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('../product').then((m) => m.FEATURE_PRODUCT_ROUTES),
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
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../purchase').then((m) => m.FEATURE_PURCHASE_ROUTES),
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../dayend').then((m) => m.FEATURE_DAYEND_ROUTES),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../supplier').then((m) => m.FEATURE_SUPPLIER_ROUTES),
  }, {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../opening-account').then((m) => m.FEATURE_OPENING_ACCOUNT_ROUTES),
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
