import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { SalesService } from '../../data/services/sales.services';
// Project

import { NepaliDateFormatterPipe } from 'src/app/domains/shared/pipes/nepali-date-formatter.pipe';
import { FilterValues } from '../../data/models/sales.model';
import { TableOperations } from 'src/app/domains/shared/ui-common/table-operations/table-operations';
// eslint-disable-next-line @nx/enforce-module-boundaries

@Component({
  selector: 'app-sales',
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NepaliDateFormatterPipe,
    TableOperations,
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent {
  filterSignal = signal<FilterValues>({});

  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly salesService = inject(SalesService);

  constructor() {
    // effect(() => {
    //   const filters = this.filterSignal();
    //   if (Object.keys(filters).length > 0) {
    //     this.fetchPatientList(filters); // You can call your API here
    //   }
    // });
  }

  ngOnInit(): void {}

  onSearch(query?: any) {
    console.log('search', query);

    // if (!query || !this.hasValidQuery(query)) {
    //   return;
    // }
    this.data$ = this.salesService.getSalesList(query);
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

  onDelete(id: number) {}

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
}
