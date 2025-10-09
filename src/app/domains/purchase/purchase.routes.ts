import { Routes } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
// import { TransactionFormComponent } from 'transaction/transaction-form/transaction-form.component';
// import { PurchaseReturnFormComponent } from 'purchase-return-form/purchase-return-form.component';

export const FEATURE_PURCHASE_ROUTES: Routes = [
  {
    path: 'list-purchase',
    component: PurchaseComponent,
    data: {
      breadcrumb: 'Purchase',
    },
  },
  {
    path: 'add-purchase',
    component: PurchaseFormComponent,
    data: {
      breadcrumb: 'Add Purchse',
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
