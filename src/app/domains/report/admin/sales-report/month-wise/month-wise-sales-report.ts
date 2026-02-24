import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { IFiscalDto } from '../../../../dayend';
import { DayendService } from '../../../../dayend/data/services/dayend.service';
import { FilterValues } from '../../../../sales/data/models/sales.model';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { ISalesReportMonthWise } from '../../../data/models/purhase-report.model';
import { ReportService } from '../../../data/services/report.services';

@Component({
  selector: 'app-month-wise-sales-report',
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
  templateUrl: './month-wise-sales-report.html',
  styleUrl: './month-wise-sales-report.scss',
})
export class MonthWiseSalesReport {
  filterSignal = signal<FilterValues>({
    fiscalId: 0
  });
  data$!: Observable<ISalesReportMonthWise[]>;
  fiscalYearListSignal = signal<IFiscalDto[]>([]);


  private readonly reportService = inject(ReportService);
  private dayendService = inject(DayendService);
  private destroyRef = inject(DestroyRef);



  ngOnInit(): void {
    this.dayendService.getFiscalList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fiscalYears => {
        this.fiscalYearListSignal.set(fiscalYears);
      });

    this.onSearch(this.filterSignal());
  }

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getSalesReportMonthWise(query);
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
