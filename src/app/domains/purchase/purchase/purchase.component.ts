import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PurchaseService } from '../data/services/purchase.services';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FilterValues } from '../../sales/data/models/sales.model';
import { NepaliDateFormatterPipe } from '../../shared/pipes/nepali-date-formatter.pipe';
import { SearchPipe } from '../../shared/pipes/search.pipe';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../shared/ui-common/table-operations/table-operations.component';
import { IPurchaseTransaction1Dto } from '../data/models/purhase.model';

@Component({
  selector: 'app-purchase',
  imports: [
    CommonModule,
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

  data: IPurchaseTransaction1Dto[] = [];
  filterSignal = signal<FilterValues>({});
  showExportSignal = signal<boolean>(false);

  listOfColumns: any[] = [
    {
      name: '#',
    },
    {
      name: 'Name',
    },
    {
      name: 'Address',
    },
    {
      name: 'Ref Type',
    },
    {
      name: 'Save Date',
    },
    {
      name: 'PayType',
      listOfFilter: [
        { text: 'Bank', value: 'BANK' },
        { text: 'Cash', value: 'CASH' },
        { text: 'Credit', value: 'CREDIT' },
      ],
      filterFn: (address: string, item: any) =>
        item.payType.indexOf(address) !== -1,
    },
    {
      name: 'Bill No.',
    },
    {
      name: 'Discount Amt.',
    },
    {
      name: 'Amount',
    },
  ];

  private readonly router = inject(Router);
  private readonly purchseService = inject(PurchaseService);

  constructor() {
    // effect(() => {
    //   const filters = this.filterSignal();
    //   if (Object.keys(filters).length > 0) {
    //     this.fetchPatientList(filters); // You can call your API here
    //   }
    // });
  }

  ngOnInit(): void {}

  onSearch(query: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.purchseService
      .getPurchaseList(query)

      .subscribe((res: any) => {
        console.log('data', res);
        this.data = [...res];
        res.length === 0
          ? this.showExportSignal.update(() => false)
          : this.showExportSignal.update(() => true);
      });
  }

  onAdd() {
    this.router.navigate(['auth/add-purchase'], {
      queryParams: { supplierId: 1, purchaseMasterId: 0 },
    });
  }

  onDelete(id: number) {}

  onEdit(id: number) {
    this.router.navigate(['auth/add-purchase'], {
      queryParams: { masterId: id },
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
    const exportData = this.data.map((item: any) => ({
      'Supplier Name': item.supplierName,
      'Supplier Address': item.supplierAddress,
      'Ref Type': item.refType, // Keep as number for Excel formatting
      'Save Date': item.saveDate,
      'Bill No.': item.billNo,
      'Discount Amt.': item.disAmount,
      'Amount.': item.amount,
    }));

    // Create worksheet from JSON
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, {
      header: [
        'Supplier Name',
        'Supplier Address',
        'Ref Type',
        'Save Date',
        'Bill No.',
        'Discount Amt.',
        'Amount.',
      ],
      skipHeader: false, // Include headers
    });

    // Optionally, set column widths for better readability
    ws['!cols'] = [
      { wch: 30 }, // Product Name width
      { wch: 20 }, // Category width
      { wch: 10 }, // Price width
      { wch: 10 }, // Quantity width
      { wch: 15 }, // Status width
    ];

    // Create workbook and append worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Purchase Report');

    // Write workbook and save file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'purchase_report.xlsx');
  }
}
