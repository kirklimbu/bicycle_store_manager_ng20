import { Route } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { SalesEntryFormComponent } from './admin/sales/sales-entry-form/sales-entry-form.component';
import { SalesComponent } from './admin/sales/sales.component';
import { SalesReturnFormComponent } from './admin/sales-return-form/sales-return-form.component';
import { SalesReturn } from './admin/sales/sales-return/sales-return';
import { SalesMaster } from './admin/sales/sales-master/sales-master';

export const FEATURE_SALES_ROUTES: Route[] = [
  {
    path: 'list-sales',
    component: SalesComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Sales List',

    },

  },
  {
    path: 'add-sales',
    component: SalesEntryFormComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: ' New Sales Entry',

    },
  },
  {
    path: 'sales-master',
    component: SalesMaster,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: ' Sales Master List',

    },
  },
  {
    path: 'sales-return',
    component: SalesReturn,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: ' Sales Return List',

    },
  }, {
    path: 'add-sales-return',
    component: SalesReturnFormComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'New Sales Return Entry',

    },
  },
];
