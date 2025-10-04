import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { ListCompany } from './admin/list-company/list-company';
import { AddCompany } from './admin/add-company/add-company';

export const FEATURE_COMPANY_ROUTES: Routes = [
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'list-company',
    component: ListCompany,
  },
  {
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
    },
    path: 'add-company',
    component: AddCompany,
  },
];
