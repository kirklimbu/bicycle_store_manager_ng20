import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { IProduct } from '../../data/models/product.model';
import { ProductService } from '../../data/services/product.services';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-list-product',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzImageModule,
    NzTagModule
  ],
  templateUrl: './list-product.html',
  styleUrl: './list-product.scss',
})
export class ListProduct {
  data$!: Observable<IProduct[]>;
  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.productService.getProductList();
  }

  onViewDetail(id: number): void {
    this.router.navigate(['/auth/product-detail'], {
      queryParams: {
        id: id,
      },
    });
  }


  onEdit(id: number): void {
    this.router.navigate(['/auth/add-product'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-product']);
  }

}
