import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { ICategory } from '../../../data/model/category.model';
import { CategoryService } from '../../../data/services/category-service';
import { NzTagModule } from 'ng-zorro-antd/tag';
// import { IEventCategoryDto } from '../../data/model/event.model';

@Component({
  selector: 'app-list-category',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzImageModule,
    NzTagModule
    // SearchPipe,
  ],
  templateUrl: './list-category.html',
  styleUrl: './list-category.scss',
})
export class ListCategory {
  data$!: Observable<ICategory[]>;
  private router = inject(Router);
  private eventService = inject(CategoryService);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.eventService.getAdminCategoryList();
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-category'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-category']);
  }

  isApproved(status: string): boolean {
    return status === 'Approved';
  }
}
