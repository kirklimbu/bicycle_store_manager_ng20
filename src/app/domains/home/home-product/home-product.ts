import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  Input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { AuthState } from '../../auth/login/state/login.state';
import { CartService } from '../../cart/data/services/cart.services';
import { IProduct } from '../data/model/home.model';

import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { debounceTime, Subject } from 'rxjs';
import { SearchService } from '../../search-result-page/data/service/search.service';
@Component({
  selector: 'app-home-product',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzGridModule,
    NzImageModule,
    NzInputNumberModule,
    NzCarouselModule,
    NzTypographyModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
  ],
  templateUrl: './home-product.html',
  styleUrl: './home-product.scss',
})
export class Homeproduct implements OnInit {
  // props
  size: NzButtonSize = 'large';
  fallback =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

  // @Input() data!: IProduct[];
  // @Input() set data(products: IProduct[]) {
  //   this.productState.setData(products);
  // }

  data = input<IProduct[]>([]);

  title = input<string>('Our Products');
  enableDelete = input<boolean>(false);
  enableDeleteAll = input<boolean>(false);
  showActionButtons = input<boolean>(true);
  delete = output<number>();
  emptyCart = output<void>();

  // Track quantities per product by stockMasterId
  quantities = signal<Record<number, number>>({});
  private quantityChanges$ = new Subject<{
    productId: number;
    value: number;
  }>();

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly authState = inject(AuthState);
  authenticated = this.authState.isAuthenticated;
  productState = inject(SearchService);

  constructor() {
    effect(() => {
      const products = this.data();
      this.productState.setData(products);
    });
    this.quantityChanges$
      .pipe(debounceTime(400))
      .subscribe(({ productId, value }) => {
        // const item = this.data.find((p) => p.stockMasterId === productId);
        const item = this.productState
          .filteredProducts()
          .find((p) => p.stockMasterId === productId);
        if (item) this.updateStock(item, value);
      });
  }
  ngOnInit() {
    // console.log('stock data', this.authenticated);
  }

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
      // this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
      this.productState
        .filteredProducts()
        .find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    this.updateQuantity(productId, current + 1);
  }

  decreaseQty(productId: number): void {
    const backendQty =
      // this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
      this.productState
        .filteredProducts()
        .find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    if (current > 0) {
      this.updateQuantity(productId, current - 1);
    }
  }

  updateStock(item: any, change: number) {
    console.log('updating stock for item', item, 'with change', change);
    if (change === null) return;
    const payload = {
      stockMasterId: item.stockMasterId,
      unitId: item.unitId,
      qty: this.quantities()[item.stockMasterId] || 0,
    };

    this.cartService.saveCart(payload).subscribe((res) => {
      const updatedProduct = res;
      // this.data = this.data.map((product) =>
      const updatedDate = this.productState
        .filteredProducts()
        .map((product) =>
          product.stockMasterId === updatedProduct.stockMasterId
            ? { ...product, ...updatedProduct }
            : product
        );
      this.productState.setData(updatedDate);

      this.cartService.refreshCartCount();
    });
  }
  onViewDetails(id: any) {
    console.log('click', id);
    this.router.navigate(['product-detail'], { queryParams: { id: id } });
  }

  removeItem(id: number) {
    this.delete.emit(id);
  }

  onEmptyCart() {
    this.emptyCart.emit();
  }
}
