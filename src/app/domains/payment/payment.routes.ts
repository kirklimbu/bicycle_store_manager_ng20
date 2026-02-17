import { Routes } from '@angular/router';
import { hasRoleGuard } from '../shared/util-auth/guards/hasRole.guard';
import { Role } from '../shared/util-auth/models/user.model';
import { PaymentList } from './admin/payment-list/payment-list';
import { PaymentEntryForm } from './admin/payment-entry-form/payment-entry-form';

export const FEATURE_PAYMENT_ROUTES: Routes = [
  {
    path: 'list-payment',
    component: PaymentList,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN],
      breadcrumb: 'Payment List',

    },

  },
  {
    path: 'add-payment',
    canActivate: [hasRoleGuard],

    component: PaymentEntryForm,
    data: {
      roles: [Role.ADMIN],

      breadcrumb: 'New Payment Entry',
    },
  },

];
