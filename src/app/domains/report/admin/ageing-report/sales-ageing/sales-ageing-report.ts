import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../../sales/data/models/sales.model';
import { DayendStore } from '../../../../shared/services/dayendstore.service';
import { ReportService } from '../../../data/services/report.services';
import { IPurchaseAgingReport, ISalesAgingReport } from '../../../data/models/ageing-report.model';

@Component({
  selector: 'app-sales-ageing-report',
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
  templateUrl: './sales-ageing-report.html',
  styleUrl: './sales-ageing-report.scss',
})
export class SalesAgeingReport {
  filterSignal = signal<FilterValues>({});
  data$!: Observable<ISalesAgingReport[]>;

  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private dayendStore = inject(DayendStore);

  initialFilters = linkedSignal(() => {
    const range = this.dayendStore.getInitialRange();
    return {
      fromDate: range.from,
      toDate: range.to
    };
  });

  ngOnInit(): void {
    this.onSearch(this.initialFilters());
  }

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getSalesAgeingReport(query);
  }
}
