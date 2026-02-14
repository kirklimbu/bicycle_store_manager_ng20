import { Routes } from '@angular/router';

import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { PurchaseListReport } from './admin/purchase-list-report';

export const FEATURE_REPORT_ROUTES: Routes = [
  {
    path: 'report-purchase',
    component: PurchaseListReport,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Purchase Report List',

    },

  },



];
