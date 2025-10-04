import { Route } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { SalesEntryFormComponent } from './admin/sales/sales-entry-form/sales-entry-form.component';
import { SalesComponent } from './admin/sales/sales.component';

export const FEATURE_SALES_ROUTES: Route[] = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'sales',
    component: SalesComponent,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'add-sales',
    component: SalesEntryFormComponent,
  },
  // { path: 'add-sales-return', component: SalesReturnFormComponent },
];
