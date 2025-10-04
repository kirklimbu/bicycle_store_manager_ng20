import { IProduct } from './../../../home/data/model/home.model';
import { Component, Input, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-qty-control-buttons',
  imports: [NzInputModule, NzIconModule, NzButtonModule, FormsModule],
  templateUrl: './qty-control-buttons.html',
  styleUrl: './qty-control-buttons.scss',
})
export class QtyControlButtons {
  // props

  enableDelete = input<boolean>(false);
  @Input() data!: IProduct[];
  product = input<IProduct>();
  enableDeleteAll = input<boolean>(false);
  showActionButtons = input<boolean>(true);
  delete = output<number>();
  emptyCart = output<void>();

  quantities = signal<Record<number, number>>({});
  private quantityChanges$ = new Subject<{
    productId: number;
    value: number;
  }>();

  getQty(productId: number, fallbackQty: number): number {
    return this.quantities()[productId] ?? fallbackQty ?? 0;
  }

  updateQuantity(productId: number, value: number): void {
    if (value < 0) value = 0;
    this.quantities.update((q) => ({ ...q, [productId]: value }));

    this.quantityChanges$.next({ productId, value });
  }
  increaseQty(productId: number): void {
    const backendQty =
      this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    this.updateQuantity(productId, current + 1);
  }

  decreaseQty(productId: number): void {
    const backendQty =
      this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    if (current > 0) {
      this.updateQuantity(productId, current - 1);
    }
  }

  removeItem(id: number) {
    this.delete.emit(id);
  }

  onEmptyCart() {
    this.emptyCart.emit();
  }
}
