import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import {
  IStockDetailDto,
  IStockDetailFormDto,
} from './../../../data/model/stock';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, inject, computed } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { StockService } from '../../../data/services/stock.service';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';

@Component({
  selector: 'app-list-stock-detail',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NepaliDateFormatterPipe,
  ],
  templateUrl: './list-stock-detail.html',
  styleUrl: './list-stock-detail.scss',
})
export class ListStockDetail {
  data$!: Observable<IStockDetailDto[]>;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private stockService = inject(StockService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    stockMasterId: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  ngOnInit(): void {
    this.fetchList();
  }

  private fetchList(): void {
    console.log('calling fetch list');
    this.data$ = this.stockService.getStockDetailList(
      this.idsSignal().stockMasterId
    );
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-stock-detail'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-stock-detail'], {
      queryParams: {
        id: this.idsSignal().stockMasterId,
      },
    });
  }
}
