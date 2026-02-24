import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { SearchPipe } from 'src/app/domains/shared/pipes/search.pipe';
import { CustomerService } from '../../data/services/customer-service';
import { ICustomer } from '../../data/services/model/customer.model';
import { TableActionButtonsComponent } from '../../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { TableOperationsComponent } from '../../../shared/ui-common/table-operations/table-operations.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-list-customer',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // third-party
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    // project
    SearchPipe,
    TableOperationsComponent,
    TableActionButtonsComponent,
  ],

  templateUrl: './list-customer.html',
  styleUrl: './list-customer.scss',
})
export class ListCustomer implements OnInit {
  searchValue = '';
  staffId = 0;
  data$!: Observable<ICustomer[]>;

  private router = inject(Router);
  private staffService = inject(CustomerService);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.staffService.getCustomerList();
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-customer'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-customer']);
  }

  onShowSales(id: number): void {
    this.router.navigate(['/auth/list-sales'], {
      queryParams: {
        customerId: id,
      },
    });
  }
}
