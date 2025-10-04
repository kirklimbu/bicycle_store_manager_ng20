import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { AddStock } from './admin/add-stock/add-stock';
import { ListStock } from './admin/list-stock/list-stock';
import { AddStockDetail } from './admin/stock-detail/add-stock-detail/add-stock-detail';
import { ListStockDetail } from './admin/stock-detail/list-stock-detail/list-stock-detail';

export const FEATURE_STOCK_ROUTES: Routes = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'list-stock',
    component: ListStock,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'add-stock',
    component: AddStock,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'add-stock-detail',
    component: AddStockDetail,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'list-stock-detail',
    component: ListStockDetail,
  },
];
