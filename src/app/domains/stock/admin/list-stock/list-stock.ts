import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { toSignal } from '@angular/core/rxjs-interop';

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
    NzTagModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,

    // SearchPipe,
    // project
    TableOperationsComponent,
    TableActionButtonsComponent,

  ],
  templateUrl: './list-stock.html',
  styleUrl: './list-stock.scss',
})
export class ListStock {
  // props
  searchTerm = signal<string>('');
  data$!: Observable<IStock[]>;

  private router = inject(Router);
  private stockService = inject(StockService);
  private rawData = toSignal(this.stockService.getStockList(), { initialValue: [] });

  filteredData = computed(() => {
    const data = this.rawData();
    const term = this.searchTerm().trim();

    if (!term) return data;

    // Local search logic (similar to your matchValue in the pipe)
    const regex = new RegExp(term, 'gi');
    return data.filter(item =>
      Object.values(item).some(val => regex.test(String(val)))
    );
  });


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
  onEdit2(id: number): void {
    this.router.navigate(['/auth/add-stock2'], {
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

  onAdd2() {
    console.log('purchae click');
    this.router.navigate(['/auth/add-stock2']);


    // this.router.navigate(['auth/purchase-master'], {
    //   queryParams: { supplierId: this.supplierIdSignal() },
    // });
  }

  onPurchaseReturn() {
    // this.router.navigate(['auth/purchase-return'], {
    //   queryParams: {
    //     supplierId: this.supplierIdSignal(),
    //     purchaseReturnMasterId: 0,
    //   },
    // });
  }

  // local search
  onLocalSearch(value: string): void {
    this.searchTerm.set(value);
  }
}
