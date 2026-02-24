import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../../sales/data/models/sales.model';
import { DayendStore } from '../../../../shared/services/dayendstore.service';
import { ReportService } from '../../../data/services/report.services';
import { IPurchaseReportMonthWise } from '../../../data/models/purhase-report.model';

@Component({
  selector: 'app-month-wise-purchase-report',
  imports: [
    CommonModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzSkeletonModule,
    // project

    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,
  ],
  templateUrl: './month-wise-purchase-report.html',
  styleUrl: './month-wise-purchase-report.scss',
})
export class MonthWisePurchaseReport {
  filterSignal = signal<FilterValues>({
    fiscalId: 1
  });
  data$!: Observable<IPurchaseReportMonthWise[]>;


  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private dayendStore = inject(DayendStore);




  ngOnInit(): void {
    this.onSearch(this.filterSignal());
  }

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getPurchaseReportMonthWise(query);
  }

  calculateTotal(data: any[]): number {
    if (!data || data.length === 0) return 0;

    return data.reduce((acc, item) => {
      // Ensure we handle potential string values from backend
      const amount = typeof item.netAmt === 'string' ? parseFloat(item.netAmt) : item.netAmt;
      return acc + (amount || 0);
    }, 0);
  }
}
