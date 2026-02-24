import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { PurchaseListReport } from './admin/purchase-report/purchase-list-report/purchase-list-report';
import { PurchaseMasterListReport } from './admin/purchase-report/purchase-master-list-report/purchase-master-list-report';
import { PurchaseDetailListReport } from './admin/purchase-report/purchase-detail-list-report/purchase-detail-list-report';
import { SalesMasterListReport } from './admin/sales-report/sales-master-list-report/sales-master-list-report';
import { SalesDetailListReport } from './admin/sales-report/sales-detail-list-report/sales-detail-list-report';
import { ClosingReport } from './admin/closing-report/closing-report';
import { ProfitLossReport } from './admin/profitLoss-report/profitLoss-report';
import { MonthWiseSalesReport } from './admin/sales-report/month-wise/month-wise-sales-report';
import { SalesComponent } from '../sales/admin/sales/sales.component';
import { MonthWisePurchaseReport } from './admin/purchase-report/month-wise-purchase/month-wise-purchase-report';
import { GeneralLedgerReport } from './admin/ledger-report/general/general-ledger-report';
import { StockLedgerReport } from './admin/ledger-report/stock-ledger/stock-ledger-report';

export const FEATURE_REPORT_ROUTES: Routes = [
  {
    path: 'report-purchase-stock-wise',
    component: PurchaseListReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Purchase Report List' },
  }, {
    path: 'report-purchase-month-wise',
    component: MonthWisePurchaseReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Purchase Report List' },
  },
  {
    path: 'report-purchase-master',
    component: PurchaseMasterListReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Purchase Master Report' }
  },
  {
    path: 'report-purchase-detail',
    component: PurchaseDetailListReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Purchase Detail Report' },
  },
  // Sales Reports
  {
    path: 'report-sales-master', // Changed to match your Sidebar Link
    component: SalesMasterListReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Sales Master Report' }
  },
  {
    path: 'report-sales-detail',
    component: SalesDetailListReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Sales Detail Report' },
  },
  // Nested VAT Reports (matching your sidebar's requested names)
  {
    path: 'report-sales-month-wise',
    component: MonthWiseSalesReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'VAT Month Wise Report' },
  },
  {
    path: 'list-sales',
    component: SalesComponent, // Update this if you have a specific stock-wise component
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'VAT Stock Wise Report' },
  },
  // Others
  {
    path: 'report-closing-stock',
    component: ClosingReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Closing Stock Report' },
  },
  {
    path: 'report-profit-loss',
    component: ProfitLossReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Profit Loss Report' }
  }
  // ledger reports 
  ,
  {
    path: 'report-ledger-general',
    component: GeneralLedgerReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'General Ledger Report' }
  },
  {
    path: 'report-ledger-stock',
    component: StockLedgerReport,
    canActivate: [hasRoleGuard],
    data: { roles: [Role.ADMIN], breadcrumb: 'Stock Ledger Report' }
  }
];
