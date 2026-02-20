import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { SalesService } from '../../data/services/sales.services';
// Project
import { toSignal } from '@angular/core/rxjs-interop';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NepaliDateFormatterPipe } from 'src/app/domains/shared/pipes/nepali-date-formatter.pipe';
import { DayendStore } from '../../../shared/services/dayendstore.service';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { FilterValues } from '../../data/models/sales.model';
// eslint-disable-next-line @nx/enforce-module-boundaries

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    // project

    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,

  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  // props

  manualSelectorOptions: { categoryId: string; name: string }[] = [
    { categoryId: '1', name: 'CASH' },
    { categoryId: '2', name: 'CREDIT' },
    { categoryId: '3', name: 'BANK' },
  ];
  filterSignal = signal<FilterValues>({});
  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly salesService = inject(SalesService);
  private readonly route = inject(ActivatedRoute);
  private dayendStore = inject(DayendStore);

  initialFilters = linkedSignal(() => {
    const range = this.dayendStore.getInitialRange();
    return {
      fromDate: range.from,
      toDate: range.to
    };
  });

  private readonly queryParamMap = toSignal(this.route.queryParamMap);
  readonly isCustomerMode = computed(() => {
    const params = this.queryParamMap();
    const customerId = params?.get('customerId');
    return !!customerId && !isNaN(Number(customerId));
  });
  // 3. Optional: If you need the ID specifically for your methods
  readonly customerId = computed(() => Number(this.queryParamMap()?.get('customerId')) || 0);


  ngOnInit(): void { }

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.salesService.getSalesList(query);
  }

  private hasValidQuery(query: any): boolean {
    return !!(
      (query.search && query.search.trim() !== '') ||
      (query.dropdownId && query.dropdownId.trim() !== '') ||
      query.fromDate ||
      query.toDate
    );
  }

  onAdd() {
    this.router.navigate(['purchase/add-purchase'], {
      queryParams: { patientId: 0 },
    });
  }

  onDelete(id: number) { }

  onEdit(id: number) {
    this.router.navigate(['patient/add-patient'], {
      queryParams: { patientId: id },
    });
  }

  onViewMore(id: number) {
    console.log('view mofre');
    this.router.navigate(['/master'], { queryParams: { patientId: id } });
  }

  showTransaction(id: number) {
    console.log('show ', id);

    this.router.navigate(['/patient/patient-transaction'], {
      queryParams: { customerId: id },
    });
  }

  onFilterChange(filter: any) {
    console.log('Applied filter:', filter);
    // Apply filter to your table data here
    this.onSearch(filter);
  }

  // onExportToExcel(data: any): void {
  //   console.log('data for export', data);
  //   // Map your data to match Excel columns and headers
  //   const exportData = this.data.map((item: any) => ({
  //     'Supplier Name': item.supplierName,
  //     'Supplier Address': item.supplierAddress,
  //     'Ref Type': item.refType, // Keep as number for Excel formatting
  //     'Save Date': item.saveDate,
  //     'Bill No.': item.billNo,
  //     'Discount Amt.': item.disAmount,
  //     'Amount.': item.amount,
  //   }));

  //   // Create worksheet from JSON
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, {
  //     header: [
  //       'Supplier Name',
  //       'Supplier Address',
  //       'Ref Type',
  //       'Save Date',
  //       'Bill No.',
  //       'Discount Amt.',
  //       'Amount.',
  //     ],
  //     skipHeader: false, // Include headers
  //   });

  //   // Optionally, set column widths for better readability
  //   ws['!cols'] = [
  //     { wch: 30 }, // Product Name width
  //     { wch: 20 }, // Category width
  //     { wch: 10 }, // Price width
  //     { wch: 10 }, // Quantity width
  //     { wch: 15 }, // Status width
  //   ];

  //   // Create workbook and append worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Purchase Report');

  //   // Write workbook and save file
  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([wbout], {
  //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   });
  //   saveAs(blob, 'purchase_report.xlsx');
  // }

  onSales() {
    console.log('purchae click');

    this.router.navigate(['auth/sales-master'], {
      queryParams: { customerId: this.customerId() },
    });
  }

  onSalesReturn() {
    this.router.navigate(['auth/sales-return'], {
      queryParams: {
        customerId: this.customerId(),
        purchaseReturnMasterId: 0,
      },
    });
  }
}
