import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@logger/message.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Observable } from 'rxjs';
import { CartService } from '../cart/data/services/cart.services';
import { Homeproduct } from '../home/home-product/home-product';
import { ICheckOutFormDtoWrapper } from './data/model/checkout.model';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthState } from '../auth/login/state/login.state';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    NzButtonModule,
    Homeproduct,
    NzGridModule,
    NzCardModule,
    NzSelectModule,
    FormsModule,
  ],

  templateUrl: 'checkout.html',
  styleUrl: 'checkout.scss',
})
export class Checkout {
  selectedCustomerId: number;
  data$!: Observable<ICheckOutFormDtoWrapper>;

  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private router = inject(Router);
  private authState = inject(AuthState);

  ngOnInit() {
    this.fetchCartItems();
  }

  fetchCartItems() {
    this.data$ = this.cartService.fetchCheckoutForm();
  }

  onSave() {
    const userId = this.authState.user()?.userId;
    const payload = {
      customerId: this.selectedCustomerId,
      userId: userId,
    };
    this.cartService.saveCheckout(payload).subscribe((res) => {
      this.messageService.createMessage('success', res.message);
      this.router.navigate(['/home']);
      this.cartService.refreshCartCount();
    });
  }
}
