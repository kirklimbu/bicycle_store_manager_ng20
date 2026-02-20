import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BsDateInputDirective } from '../../../shared/directives/bsdate/bs-date-input.directive';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { NepaliDateFormatterPipe } from '../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../sales/data/models/sales.model';
import { ReportService } from '../../data/services/report.services';

@Component({
  selector: 'app-closing-report',
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
  templateUrl: './closing-report.html',
  styleUrl: './closing-report.scss',
})
export class ClosingReport {

  manualSelectorOptions: { categoryId: string; name: string }[] = [
    { categoryId: '1', name: 'CASH' },
    { categoryId: '2', name: 'CREDIT' },
    { categoryId: '3', name: 'BANK' },
  ];
  filterSignal = signal<FilterValues>({});
  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);


  private readonly queryParamMap = toSignal(this.route.queryParamMap);
  readonly isCustomerMode = computed(() => {
    const params = this.queryParamMap();
    const customerId = params?.get('customerId');
    return !!customerId && !isNaN(Number(customerId));
  });
  // 3. Optional: If you need the ID specifically for your methods
  readonly customerId = computed(() => Number(this.queryParamMap()?.get('customerId')) || 0);

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    this.data$ = this.reportService.getClosingStockReportList();

  }

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getPurchaseReportList(query);
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
