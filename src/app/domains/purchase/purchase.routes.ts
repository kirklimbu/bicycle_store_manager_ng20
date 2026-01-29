import { Routes } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseMaster } from './purchase/purchase-master/purchase-master';
import { PurchaseReturn } from './purchase-return/purchase-return';
import { PurchaseReturnForm } from './purchase-return-form/purchase-return-form';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
// import { TransactionFormComponent } from 'transaction/transaction-form/transaction-form.component';
// import { PurchaseReturnFormComponent } from 'purchase-return-form/purchase-return-form.component';

export const FEATURE_PURCHASE_ROUTES: Routes = [
  {
    path: 'list-purchase',
    component: PurchaseComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Purchase List',

    },

  },
  {
    path: 'add-purchase',
    canActivate: [hasRoleGuard],

    component: PurchaseFormComponent,
    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'New Purchse Entry',
    },
  },
  {
    path: 'purchase-master'
    ,
    component: PurchaseMaster,
    canActivate: [hasRoleGuard],

    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'Purchase Master List',
    },
  },
  {
    path: 'purchase-return',
    component: PurchaseReturn,
    canActivate: [hasRoleGuard],

    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'Purchase Return List',
    },
  },
  {
    path: 'add-purchase-return',
    component: PurchaseReturnForm,
    canActivate: [hasRoleGuard],

    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'New Purchase Return',
    },
  },
  // {
  //   path: 'add-transaction',
  //   component: TransactionFormComponent,
  //   data: {
  //     breadcrumb: 'Add Transaction',
  //   },
  // },
  // {
  //   path: 'add-purchase-return',
  //   component: PurchaseReturnFormComponent,
  //   data: {
  //     breadcrumb: 'Add Purchase Return',
  //   },
  // },
];
