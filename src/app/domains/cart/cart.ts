import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '@logger/message.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, of, shareReplay } from 'rxjs';
import { IProduct } from '../home/data/model/home.model';
import { Homeproduct } from '../home/home-product/home-product';
import { CartService } from './data/services/cart.services';
@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NzButtonModule,

    Homeproduct,

    NzGridModule,
    NzModalModule,
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  // props
  selectedCustomerId: number;
  showSummary = signal(false);
  data$!: Observable<IProduct[]>;

  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private router = inject(Router);
  private modal = inject(NzModalService);

  ngOnInit() {
    this.fetchCartItems();
  }
  fetchCartItems() {
    this.data$ = this.cartService
      .getCartList()
      .pipe(takeUntilDestroyed(this.destroyRef), shareReplay(1));
  }

  onCheckout() {
    this.router.navigate(['home/check-out']);
  }

  onDelete(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to remove item from cart?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete',
      nzOnOk: () => this.confirmDelete(id),
    });
  }

  confirmDelete(id: number): void {
    // Call your service to delete the item
    console.log('Deleting service with ID:', id);
    this.cartService.deleteItem(id).subscribe((res) => {
      this.messageService.createMessage('success', res.message);
      this.data$ = of(res.stockList);
      this.cartService.refreshCartCount();
    });
  }

  onEmptyCart(id: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to remove all item from cart?',
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Yes, Delete',
      nzOnOk: () => this.deleteAll(),
    });
  }

  deleteAll() {
    this.cartService.deleteAllItem().subscribe((res) => {
      this.messageService.createMessage('success', res.message);
      this.data$ = of(res.stockList);
    });
  }
}
