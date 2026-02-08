import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { AddProduct } from './admin/add-product/add-product';
import { ListProduct } from './admin/list-product/list-product';

export const FEATURE_PRODUCT_ROUTES: Routes = [
  {
    path: 'list-product',
    component: ListProduct,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Product List',

    },

  },
  {
    path: 'add-product',
    canActivate: [hasRoleGuard],

    component: AddProduct,
    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'New Product Entry',
    },
  },

];
