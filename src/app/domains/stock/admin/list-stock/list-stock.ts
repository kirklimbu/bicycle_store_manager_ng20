import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { IStock } from '../../data/model/stock';
import { StockService } from '../../data/services/stock.service';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-list-stock',
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
    // SearchPipe,
  ],
  templateUrl: './list-stock.html',
  styleUrl: './list-stock.scss',
})
export class ListStock {
  // props
  data$!: Observable<IStock[]>;

  private router = inject(Router);
  private stockService = inject(StockService);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.stockService.getStockList();
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-stock'], {
      queryParams: {
        id: id,
      },
    });
  }
  onViewDetail(id: number): void {
    this.router.navigate(['/auth/list-stock-detail'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-stock']);
  }
}
