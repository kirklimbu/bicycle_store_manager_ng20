import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../shared/pipes/nepali-date-formatter.pipe';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../sales/data/models/sales.model';
import { ReportService } from '../../data/services/report.services';

@Component({
  selector: 'app-sales-master-list-report',
  imports: [RouterModule,
    CommonModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    // project

    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,
    TableActionButtonsComponent],
  templateUrl: './sales-master-list-report.html',
  styleUrl: './sales-master-list-report.scss',
})
export class SalesMasterListReport {

  manualSelectorOptions = [
    { id: '1', name: 'cash' },
    { id: '2', name: 'credit' },
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

  ngOnInit(): void { }

  onSearch(query?: any) {

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getSalesMasterReportList(query);
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
    this.router.navigate(['/auth/report-sales-detail'], { queryParams: { id: id } });
  }



  onFilterChange(filter: any) {

    this.onSearch(filter);
  }

  onSales() {

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
