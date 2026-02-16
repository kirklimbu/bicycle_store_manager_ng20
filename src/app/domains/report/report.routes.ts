import { Routes } from '@angular/router';

import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { PurchaseListReport } from './admin/purchase-list-report/purchase-list-report';
import { PurchaseMaster } from '../purchase/purchase/purchase-master/purchase-master';
import { PurchaseMasterListReport } from './admin/purchase-master-list-report/purchase-master-list-report';
import { PurchaseDetailListReport } from './admin/purchase-detail-list-report/purchase-detail-list-report';

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
  {
    path: 'report-purchase-master',
    component: PurchaseMasterListReport,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Purchase Master Report',

    }
  }
  , {
    path: 'report-purchase-detail',
    component: PurchaseDetailListReport,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Purchase Detail Report',

    },

  },



];
