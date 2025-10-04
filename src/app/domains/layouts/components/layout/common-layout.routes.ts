import { Routes } from '@angular/router';

export const COMMON_LAYOUT_ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('../../../home').then((m) => m.FEATURE_HOME_ROUTES),
  },
];
