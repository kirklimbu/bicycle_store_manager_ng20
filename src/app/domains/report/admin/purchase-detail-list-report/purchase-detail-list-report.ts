import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../shared/pipes/nepali-date-formatter.pipe';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../sales/data/models/sales.model';
import { ReportService } from '../../data/services/report.services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-purchase-detail-list-report',
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
  templateUrl: './purchase-detail-list-report.html',
  styleUrl: './purchase-detail-list-report.scss',
})
export class PurchaseDetailListReport {
  filterSignal = signal<FilterValues>({});
  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);

  private readonly queryParamMap = toSignal(this.route.queryParamMap);

  readonly purchaseMasterId = computed(() => Number(this.queryParamMap()?.get('id')) || 0);

  ngOnInit(): void {
    this.data$ = this.reportService.getPurchaseDetailReportList(this.purchaseMasterId());

  }

}
