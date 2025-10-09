import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// third-party
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
// project
import { SupplierService } from '../data/services/supplier.services';
import { TableOperationsComponent } from '../../shared/ui-common/table-operations/table-operations.component';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';

@Component({
  selector: 'app-suppliers',
  imports: [
    CommonModule,
    // third-party
    NzPageHeaderModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,

    // project
    TableOperationsComponent,
    TableActionButtonsComponent,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent {
  data$!: Observable<any[]>;

  private readonly router = inject(Router);
  private readonly supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.fetchSupplierList();
  }

  fetchSupplierList() {
    this.data$ = this.supplierService.getSuppliertList();
  }

  onAdd() {
    this.router.navigate(['/auth/add-supplier']);
  }

  onDelete(id: number) {
    console.log('delete', id);
  }

  onEdit(id: number) {
    this.router.navigate(['/auth/add-supplier'], {
      queryParams: { supplierId: id },
    });
  }

  onViewMore(id: number) {
    this.router.navigate(['/auth/list-purchase'], {
      queryParams: { supplierId: id },
    });
  }
}
