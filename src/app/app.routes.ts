import { Route } from '@angular/router';
import { COMMON_LAYOUT_ROUTES } from './domains/layouts/common-layout';
import { CommonLayoutComponent } from './domains/layouts/common-layout/common-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./domains/auth').then((m) => m.FEATURE_AUTH_ROUTES),
  },

  {
    path: '',
    component: CommonLayoutComponent,
    children: COMMON_LAYOUT_ROUTES,
  },
  // {
  //     path: '',
  //     component: FullLayoutComponent,
  //     children: FullLayout_ROUTES
  // }
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
