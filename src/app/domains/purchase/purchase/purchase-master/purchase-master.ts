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
    { name: '#', width: '60px', stickyLeft: false },
    { name: 'Bill No', width: '150px', stickyLeft: false, align: 'left' },
    { name: 'Save Date', width: '130px' },
    { name: 'Supplier Bill', width: '150px', align: 'left' },
    { name: 'Supplier Date', width: '130px' },
    { name: 'Taxable Amt.', width: '120px', align: 'right' },
    { name: 'Tax Amt.', width: '100px', align: 'right' },
    { name: 'Net Amt.', width: '120px', align: 'right' },
    { name: 'Discount', width: '100px', align: 'right' },
    { name: 'Total Amt.', width: '130px', align: 'right' },
    { name: 'Pay Type', width: '100px' },
    { name: 'Actions', width: '120px', stickyRight: true }
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
