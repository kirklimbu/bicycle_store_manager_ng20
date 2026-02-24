import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { TableActionButtonsComponent } from '../../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { Observable } from 'rxjs';
import { FilterValues } from '../../../../sales/data/models/sales.model';
import { ReportService } from '../../../data/services/report.services';
import { DayendStore } from '../../../../shared/services/dayendstore.service';

@Component({
  selector: 'app-general-ledger-report',
  imports: [
    RouterModule,
    CommonModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    // project

    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,
    TableActionButtonsComponent
  ],
  templateUrl: './general-ledger-report.html',
  styleUrl: './general-ledger-report.scss',
})
export class GeneralLedgerReport {
  // props
  manualSelectorOptions = [START FROM HERE
    { id: '1', name: 'cash' },
    { id: '2', name: 'credit' },
  ];
  filterSignal = signal<FilterValues>({});
  data$!: Observable<any[]>;

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
  onSearch(query?: any) {

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.reportService.getPurchaseMasterReportList(query);
  }

  onFilterChange(filter: any) {

    this.onSearch(filter);
  }
}
