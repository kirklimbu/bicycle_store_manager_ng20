import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportService } from '../../../data/services/report.services';

@Component({
  selector: 'app-sales-detail-list-report',
  imports: [
    CommonModule,
    NzTableModule,
    NzSpaceModule,
    // NzBreadCrumbsModule,
    NzPageHeaderModule,
    // project
    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,
  ],
  templateUrl: './sales-detail-list-report.html',
  styleUrl: './sales-detail-list-report.scss',
})
export class SalesDetailListReport {
  // props
  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParamMap = toSignal(this.route.queryParamMap);

  readonly salesMasterId = computed(() => Number(this.queryParamMap()?.get('id')) || 0);

  ngOnInit(): void {
    this.data$ = this.reportService.getSalesDetailReportList(this.salesMasterId());

  }
}
