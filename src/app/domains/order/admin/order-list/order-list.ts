import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { IOrder } from '../data/models/order.model';
import { OrderService } from '../data/services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {
  // props
  data$!: Observable<IOrder[]>;
  private orderService = inject(OrderService);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.orderService.getorderList();
  }

  onViewDetails(id: number, id2: number) {
    console.log('click', id);

    this.router.navigate(['/auth/order-detail'], {
      queryParams: { id: id, id2: id2 },
    });
  }
}
