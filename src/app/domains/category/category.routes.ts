import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { AddCategory } from './admin/add-category/add-category';
import { ListCategory } from './admin/list-category/list-category/list-category';

export const FEATURE_CATEGORY_ROUTES: Routes = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.USER, Role.ADMIN],
    },
    path: 'list-category',
    component: ListCategory,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.USER, Role.ADMIN],
    },
    path: 'add-category',
    component: AddCategory,
  },
];
