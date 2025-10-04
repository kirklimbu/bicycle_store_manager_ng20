import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { AddCustomer } from './admin/add-customer/add-customer';
import { ListCustomer } from './admin/list-customer/list-customer';

export const FEATURE_CUSTOMER_ROUTES: Routes = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.USER, Role.ADMIN],
    },
    path: 'list-customer',
    component: ListCustomer,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.USER, Role.ADMIN],
    },
    path: 'add-customer',
    component: AddCustomer,
  },
];
