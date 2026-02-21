import { Component, computed, DestroyRef, effect, inject, linkedSignal, signal } from '@angular/core';
import { IProfitLossReport } from '../../data/models/purhase-report.model';
import { FilterValues } from '../../../sales/data/models/sales.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DayendStore } from '../../../shared/services/dayendstore.service';
import { ReportService } from '../../data/services/report.services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NepaliDateFormatterPipe } from '../../../shared/pipes/nepali-date-formatter.pipe';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';

@Component({
  selector: 'app-profit-loss-report',
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
  templateUrl: './profitLoss-report.html',
  styleUrl: './profitLoss-report.scss',
})
export class ProfitLossReport {

  rawReportData = signal<any[]>([]);
  filterSignal = signal<FilterValues>({});

  // private readonly router = inject(Router);
  private readonly reportService = inject(ReportService);
  private readonly route = inject(ActivatedRoute);
  private dayendStore = inject(DayendStore);
  private destroyRef$ = inject(DestroyRef);

  initialFilters = linkedSignal(() => {
    const range = this.dayendStore.getInitialRange();
    return {
      fromDate: range.from,
      toDate: range.to
    };
  });


  // Computed signal to transform data for the UI
  // Computed signal to transform data for the UI
  readonly processedReport = computed<IProfitLossReport[]>(() => {
    const data = this.rawReportData();

    // 1. Guard against empty or null data from API
    if (!data || !Array.isArray(data)) return [];

    return data.map(item => {
      // 2. Defensive check: Fallback to empty string if item.key is missing
      const name = item.key || '';

      // 3. Count leading spaces safely
      const leadingSpaces = name.match(/^ */)?.[0].length || 0;
      const level = leadingSpaces > 0 ? 1 : 0;

      const trimmedKey = name.trim();

      return {
        key: trimmedKey,
        value: item.value ? parseFloat(item.value) : 0, // Ensure value is a number
        level: level,
        isSummary: level === 0 || ['Gross Profit', 'Total Income', 'COGS'].includes(trimmedKey)
      };
    });
  });

  constructor() {
    // Effect runs automatically when initialFilters() or dayendStore updates
    // This replaces the need to manually call onSearch in ngOnInit
    effect(() => {
      const filters = this.initialFilters();
      if (filters.fromDate && filters.toDate) {
        // Prepare the query object for the service
        const query = {
          fromDate: filters.fromDate,
          toDate: filters.toDate
        };
        this.onSearch(query);
      }
    });
  }



  ngOnInit(): void { }

  onSearch(query?: any) {

    this.reportService.getProfitLossReportList(query)
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe({
        next: (res: any) => {
          // Setting the signal triggers the 'processedReport' computed signal automatically
          this.rawReportData.set(res || []);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.rawReportData.set([]); // Clear table on error
        }
      });
  }
}
