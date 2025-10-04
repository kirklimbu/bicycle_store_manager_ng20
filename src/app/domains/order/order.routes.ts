import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { OrderList } from './admin/order-list/order-list';
import { OrderDetail } from './admin/order-detail/order-detail';

export const FEATURE_ORDER_ROUTES: Routes = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'list-order',
    component: OrderList,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'order-detail',
    component: OrderDetail,
  },
];
