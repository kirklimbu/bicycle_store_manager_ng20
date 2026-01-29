import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { SearchPipe } from '../../../../shared/pipes/search.pipe';
import { TableActionButtonsComponent } from '../../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IPurchaseTransaction1Dto } from '../../../../purchase/data/models/purhase.model';
import { PurchaseService } from '../../../../purchase/data/services/purchase.services';
import { FilterValues } from '../../../data/models/sales.model';
import { SalesService } from '../../../data/services/sales.services';

@Component({
  selector: 'app-sales-master',
  imports: [
    CommonModule,
    RouterModule,
    NzPageHeaderModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,

    // project
    TableOperationsComponent,
    TableActionButtonsComponent,
    NepaliDateFormatterPipe,
    SearchPipe,
  ],
  templateUrl: './sales-master.html',
  styleUrl: './sales-master.scss',
})
export class SalesMaster {
  ngOnInit(): void {
    this.onSearch({});
  }
  // props

  searchValue = '';
  manualSelectorOptions: { categoryId: string; name: string }[] = [
    { categoryId: '1', name: 'CASH' },
    { categoryId: '2', name: 'CREDIT' },
    { categoryId: '3', name: 'BANK' },
  ];

  filterCriteria: any = {
    name: '',
    payType: '',
    status: '',
  };
  listOfColumns: any[] = [
    {
      name: '#',
    },
    {
      name: 'BillNo',
    },
    {
      name: 'Save Date',
    },

    // {
    //   name: 'Rate',
    // },
    // {
    //   name: 'Qty.',
    // },

    {
      name: 'Taxable Amt.',
    },
    {
      name: 'Tax Amt.',
    },
    {
      name: 'Net Amt.',
    },
    {
      name: 'discount Amt.',
    },
    {
      name: 'Total Amt.',
    },
    {
      name: 'Pay Type.',
    },
    {
      name: 'Table Actions',
    },
  ];

  data: IPurchaseTransaction1Dto[] = [];
  private readonly router = inject(Router);
  private readonly destroyRef$ = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly salesService = inject(SalesService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  customerIdSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();
    return queryParamMap ? Number(queryParamMap.get('customerId')) : 0;
  });

  onSearch(query: FilterValues) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }

    const updatedQuery: FilterValues = {
      ...query,
      customerId: this.customerIdSignal(), // only include if not null
    };

    this.salesService
      .getSalesMasterList(updatedQuery)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res: any) => {
        console.log('data', res);
        this.data = [...res];
        // res.length === 0
        //   ? this.showExportSignal.update(() => false)
        //   : this.showExportSignal.update(() => true);
      });
  }

  onAdd() {
    this.router.navigate(['auth/add-sales'], {
      queryParams: { customerId: this.customerIdSignal(), salesMasterId: 0 },
    });
  }

  onEdit(data: any) {
    this.router.navigate(['auth/add-sales'], {
      queryParams: {
        customerId: data.customerId,
        salesMasterId: data.salesMasterId,
      },
    });
  }

  onDelete(id: number) { }
  onSalesReturn(sales: any) {
    console.log('purchase return', sales);
    this.router.navigate(['auth/add-sales-return'], {
      queryParams: {
        salesRetMasterId: 0,
        customerId: sales.customerId,
        salesMasterId: sales.salesMasterId,
      },
    });
  }
}
