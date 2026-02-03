import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { OpeningAccountForm } from './admin/opening-account/opening-account-form';
// import { TransactionFormComponent } from 'transaction/transaction-form/transaction-form.component';
// import { PurchaseReturnFormComponent } from 'purchase-return-form/purchase-return-form.component';

export const FEATURE_OPENING_ACCOUNT_ROUTES: Routes = [
  {
    path: 'opening',
    component: OpeningAccountForm,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Opening Account',

    },

  },
];
