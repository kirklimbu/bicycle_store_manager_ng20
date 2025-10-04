import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthState } from 'src/app/domains/auth/login/state/login.state';
import { CartService } from 'src/app/domains/cart/data/services/cart.services';

@Component({
  selector: 'app-cart-count',
  imports: [NzBadgeModule, NzIconModule],
  templateUrl: './cart-count.html',
  styleUrl: './cart-count.scss',
})
export class CartCount {
  // props

  private router = inject(Router);
  readonly authstate = inject(AuthState);
  readonly cartService = inject(CartService);

  onViewCart() {
    console.log('car');
    this.router.navigate(['/home/cart']);
  }

   cartCount() {
    const authenticated = this.authstate.isAuthenticated();
    if (authenticated) {
      return this.cartService.cartCount;
    }
  }
}
