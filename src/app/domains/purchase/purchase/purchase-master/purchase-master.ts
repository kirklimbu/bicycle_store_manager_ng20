import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, linkedSignal, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from 'src/app/domains/shared/pipes/nepali-date-formatter.pipe';
import { SearchPipe } from 'src/app/domains/shared/pipes/search.pipe';
import { TableActionButtonsComponent } from 'src/app/domains/shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from 'src/app/domains/shared/ui-common/table-operations/table-operations.component';
import { PurchaseService } from '../../data/services/purchase.services';
import { FilterValues } from 'src/app/domains/sales/data/models/sales.model';
import { IPurchaseTransaction1Dto } from '../../data/models/purhase.model';
import { DayendStore } from '../../../shared/services/dayendstore.service';

@Component({
  selector: 'app-purchase-master',
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
  templateUrl: './purchase-master.html',
  styleUrl: './purchase-master.scss',
})
export class PurchaseMaster implements OnInit {
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
    {
      name: 'Supplier BillNo',
    },
    {
      name: 'Supplier Save Date',
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
  private readonly purchseService = inject(PurchaseService);
  private dayendStore = inject(DayendStore);

  initialFilters = linkedSignal(() => {
    const range = this.dayendStore.getInitialRange();
    return {
      fromDate: range.from,
      toDate: range.to
    };
  });

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  supplierIdSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();
    return queryParamMap ? Number(queryParamMap.get('supplierId')) : 0;
  });

  onSearch(query: FilterValues) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }

    const updatedQuery: FilterValues = {
      ...query,
      supplierId: this.supplierIdSignal(), // only include if not null
    };

    this.purchseService
      .getPurchaseMasterList(updatedQuery)
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
    this.router.navigate(['auth/add-purchase'], {
      queryParams: { supplierId: this.supplierIdSignal(), purchaseMasterId: 0 },
    });
  }

  onEdit(data: any) {
    this.router.navigate(['auth/add-purchase'], {
      queryParams: {
        supplierId: data.supplierId,
        purchaseMasterId: data.purchaseMasterId,
      },
    });
  }

  onDelete(id: number) { }
  onPurchaseReturn(purchase: any) {
    console.log('purchase return', purchase);
    this.router.navigate(['auth/add-purchase-return'], {
      queryParams: {
        purRetMasterId: 0,
        supplierId: purchase.supplierId,
        purchaseMasterId: purchase.purchaseMasterId,
      },
    });
  }
}
