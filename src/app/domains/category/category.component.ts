import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
// project

//third-party
import { Router } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Observable } from 'rxjs';
import { CategoryService } from './data/services/category-service';
import { TableOperationsComponent } from '../shared/ui-common/table-operations/table-operations.component';
import { ICategory } from './data/model/category.model';
import { TableActionButtonsComponent } from '../shared/ui-common/table-action-buttons/table-action-buttons.component';

@Component({
  selector: 'lib-category',
  imports: [
    CommonModule,
    // third-party
    NzPageHeaderModule,
    NzTableModule,
    NzSpaceModule,
    NzBreadCrumbModule,
    NzBreadCrumbModule,
    NzTagModule,

    // project
    TableOperationsComponent,
    TableActionButtonsComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  data$!: Observable<ICategory[]>;

  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.fetchPatientList();
  }

  fetchPatientList() {
    this.data$ = this.categoryService.getCategoryList();
  }

  onEdit(id: number) {
    this.router.navigate(['category/add-category'], {
      queryParams: { categoryId: id },
    });
  }
  onDelete(id: number) {}
  onViewMore(id: number) {
    this.router.navigate(['item'], { queryParams: { categoryId: id } });
  }

  showTransaction(id: number) {
    console.log('show transaction');
    this.router.navigate(['sales'], { queryParams: { markaId: id } });
  }

  onAdd() {
    this.router.navigate(['category/add-category']);
  }
}
