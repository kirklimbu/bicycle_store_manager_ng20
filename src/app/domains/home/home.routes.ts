import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProductDetail } from './product-detail/product-detail';
import { Cart } from '../cart/cart';
import { AuthGuard } from '../shared/util-auth/guards/auth.guard';
import { Checkout } from '../checkout/checkout';

export const FEATURE_HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'product-detail',
    component: ProductDetail,
  },
  {
    canActivate: [AuthGuard],
    path: 'cart',
    component: Cart,
  },
  {
    canActivate: [AuthGuard],
    path: 'check-out',
    component: Checkout,
  },
];
