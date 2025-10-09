import { Routes } from '@angular/router';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SuppliersComponent } from './supplier-list/suppliers.component';

// import { SupplierTransactionComponent } from './lib/supplier-transaction/supplier-transaction.component';
// import { SupplierTransactionFormComponent } from './lib/supplier-transaction-form/supplier-transaction-form.component';

export const FEATURE_SUPPLIER_ROUTES: Routes = [
  {
    path: 'list-supplier',
    component: SuppliersComponent,
    data: {
      breadcrumb: 'Suppliers',
    },
  },
  {
    path: 'add-supplier',
    component: SupplierFormComponent,
    data: {
      breadcrumb: 'New Supplier',
    },
  },
  // {
  //     path: 'supplier-transaction',
  //     component: SupplierTransactionComponent,
  //     data: {
  //         breadcrumb: 'Supplier Transactions',
  //     }
  // },
  // {
  //     path: 'add-supplier-transaction',
  //     component: SupplierTransactionFormComponent,
  //     data: {
  //         breadcrumb: 'New Supplier Transaction',
  //     }
  // },
];
