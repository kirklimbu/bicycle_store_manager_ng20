import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    NzButtonModule,
    NzInputNumberModule,
    NzCarouselModule,
    FormsModule,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  product = signal({
    id: 1,
    name: 'Apple MacBook Pro 14"',
    price: 1999,
    description:
      'Powered by M2 Pro chip with 12-core CPU, 19-core GPU, 16GB unified memory, and 512GB SSD storage.',
    images: [
      'assets/img/macbook-front.jpg',
      'assets/img/macbook-side.jpg',
      'assets/img/macbook-keyboard.jpg',
    ],
    stock: true,
  });

  quantity = signal(1);

  updateQuantity(value: any) {
    if (value > 0) this.quantity.set(value);
  }
}
