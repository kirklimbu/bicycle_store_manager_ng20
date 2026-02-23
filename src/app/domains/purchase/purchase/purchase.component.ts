import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PurchaseService } from '../data/services/purchase.services';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FilterValues } from '../../sales/data/models/sales.model';
import { NepaliDateFormatterPipe } from '../../shared/pipes/nepali-date-formatter.pipe';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { DayendStore } from '../../shared/services/dayendstore.service';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../shared/ui-common/table-operations/table-operations.component';
import { IPurchaseTransaction1Dto } from '../data/models/purhase.model';

@Component({
  selector: 'app-purchase',
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
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent {
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

  // data: IPurchaseTransaction1Dto[] = [];
  data = signal<any[]>([]);
  filterSignal = signal<FilterValues>({});
  showExportSignal = signal<boolean>(false);

  listOfColumns: any[] = [
    { name: '#', width: '60px', align: 'center', stickyLeft: true },
    { name: 'Item', width: '200px', align: 'left', stickyLeft: true },
    { name: 'Save Date', width: '120px', align: 'center' },
    { name: 'Rate', width: '100px', align: 'right' },
    { name: 'Qty.', width: '80px', align: 'center' },
    { name: 'Taxable Amt.', width: '120px', align: 'right' },
    { name: 'Tax Amt.', width: '100px', align: 'right' },
    { name: 'Net Amt.', width: '130px', align: 'right' },
    { name: 'Table Actions', width: '120px', align: 'center', stickyRight: true },
  ];
  constructor(private service: PurchaseService) {
    // this.purchseService
    //   .getPurchaseList(this.initialFilters())
    //   // this.service.getPurchaseData()   
    //   .pipe(takeUntilDestroyed(this.destroyRef$))
    //   .subscribe(res => {
    //     this.data.set(res); // Update the signal
    //   });
  }

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

  ngOnInit(): void {
    this.onSearch(this.initialFilters());
  }

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
      .getPurchaseList(updatedQuery)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res: any) => {
        console.log('data', res);
        // this.data = [...res];
        this.data.set(res)
        res.length === 0
          ? this.showExportSignal.update(() => false)
          : this.showExportSignal.update(() => true);
      });
  }

  onAdd() {
    this.router.navigate(['auth/add-purchase'], {
      queryParams: { supplierId: this.supplierIdSignal(), purchaseMasterId: 0 },
    });
  }

  onDelete(id: number) { }

  onEdit(data: any) {
    this.router.navigate(['auth/add-purchase'], {
      queryParams: {
        supplierId: data.supplierId,
        purchaseMasterId: data.purchaseMasterId,
      },
    });
  }

  onViewMore(id: number) {
    console.log('view mofre');
    this.router.navigate(['/master'], { queryParams: { masterId: id } });
  }

  showTransaction(id: number) {
    console.log('show ', id);

    this.router.navigate(['/patient/patient-transaction'], {
      queryParams: { customerId: id },
    });
  }

  onExportToExcel(data: any): void {
    console.log('data for export', data);
    // Map your data to match Excel columns and headers
    // const exportData = this.data.map((item: any) => ({
    //   'Supplier Name': item.supplierName,
    //   'Supplier Address': item.supplierAddress,
    //   'Ref Type': item.refType, // Keep as number for Excel formatting
    //   'Save Date': item.saveDate,
    //   'Bill No.': item.billNo,
    //   'Discount Amt.': item.disAmount,
    //   'Amount.': item.amount,
    // }));

    // Create worksheet from JSON
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, {
    //   header: [
    //     'Supplier Name',
    //     'Supplier Address',
    //     'Ref Type',
    //     'Save Date',
    //     'Bill No.',
    //     'Discount Amt.',
    //     'Amount.',
    //   ],
    //   skipHeader: false, // Include headers
    // });

    // Optionally, set column widths for better readability
    // ws['!cols'] = [
    //   { wch: 30 }, // Product Name width
    //   { wch: 20 }, // Category width
    //   { wch: 10 }, // Price width
    //   { wch: 10 }, // Quantity width
    //   { wch: 15 }, // Status width
    // ];

    // Create workbook and append worksheet
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Purchase Report');

    // // Write workbook and save file
    // const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([wbout], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // });
    // saveAs(blob, 'purchase_report.xlsx');
  }

  onPurchase() {
    console.log('purchae click');

    this.router.navigate(['auth/purchase-master'], {
      queryParams: { supplierId: this.supplierIdSignal() },
    });
  }

  onPurchaseReturn() {
    this.router.navigate(['auth/purchase-return'], {
      queryParams: {
        supplierId: this.supplierIdSignal(),
        purchaseReturnMasterId: 0,
      },
    });
  }
}
