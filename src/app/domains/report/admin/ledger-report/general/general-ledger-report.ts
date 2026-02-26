import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { IAccTreeDto, IFiscalDto } from '../../../../dayend';
import { DayendService } from '../../../../dayend/data/services/dayend.service';
import { FilterValues } from '../../../../sales/data/models/sales.model';
import { BsDateInputDirective } from '../../../../shared/directives/bsdate/bs-date-input.directive';
import { NepaliDateFormatterPipe } from '../../../../shared/pipes/nepali-date-formatter.pipe';
import { DayendStore } from '../../../../shared/services/dayendstore.service';
import { FilterStoreService } from '../../../../shared/services/table-filter-store.service';
import { TableActionButtonsComponent } from '../../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../../shared/ui-common/table-operations/table-operations.component';
import { IGeneralLedgerReport } from '../../../data/models/ledger-report.model';
import { ReportService } from '../../../data/services/report.services';

@Component({
  selector: 'app-general-ledger-report',
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,

    NzSpaceModule,
    NzBreadCrumbModule,
    NzPageHeaderModule,
    NzTagModule,


    NzSpaceModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzButtonModule,
    NzFlexModule,
    NzGridModule,
    NzFormModule,
    // project
    BsDateInputDirective,
    NepaliDateFormatterPipe,
    // TableOperations,
    TableOperationsComponent,
    TableActionButtonsComponent
  ],
  templateUrl: './general-ledger-report.html',
  styleUrl: './general-ledger-report.scss',
  providers: [FilterStoreService]
})
export class GeneralLedgerReport implements OnInit {

  // props

  filterSignal = signal<FilterValues>({});
  fiscalYearListSignal = signal<IFiscalDto[]>([]);
  accTreeListSignal = signal<IAccTreeDto[]>([]);
  // data$!: Observable<IGeneralLedgerReport[]>;
  data$ = signal<IGeneralLedgerReport[]>([]);
  private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private dayendStore = inject(DayendStore);
  private dayendService = inject(DayendService);
  private fb = inject(NonNullableFormBuilder);
  private filterStore = inject(FilterStoreService);

  initialFilters = linkedSignal(() => {
    const range = this.dayendStore.getInitialRange();
    return {
      fiscalId: 0,
      accountId: 0,
      fromDate: range.from,
      toDate: range.to
    };
  });

  filterForm = this.fb.group({
    fiscalId: [null as number | null],
    accountId: [null as number | null],
    fromDate: [this.initialFilters().fromDate],
    toDate: [this.initialFilters().toDate]
  });

  applyFilters() {
    this.filterStore.updateFilters(this.filterForm.getRawValue());
    this.reportService.getGeneralLedgerReport(this.filterForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reportData => {
        this.data$.set(reportData);
      });
  }

  resetFilters() {
    this.filterForm.reset();
    this.filterStore.reset();
  }

  // Inside your Filter Component class
  formatAccountLabel(option: any): string {
    if (!option) return '';

    // Format: "Cash Account (LF-101)"
    const name = option.name || 'Unknown Account';
    const lf = option.lf ? ` (${option.lf})` : '';

    return `${name}${lf}`;
  }
  onSearch(query?: any) {

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.reportService.getGeneralLedgerReport(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(reportData => {
        this.data$.set(reportData);
      });

  }

  onFilterChange(filter: any) {

    this.onSearch(filter);
  }

  ngOnInit(): void {
    this.dayendService.getFiscalList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(fiscalYears => {
        this.fiscalYearListSignal.set(fiscalYears);
      });
    this.dayendService.getAccTreeList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(accTrees => {
        this.accTreeListSignal.set(accTrees);
      });
  }
}
