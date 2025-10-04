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
import { ICompany } from '../../data/model/company.model';
import { CompanyService } from '../../data/services/company-service';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-list-company',
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
  ],
  templateUrl: './list-company.html',
  styleUrl: './list-company.scss',
})
export class ListCompany {
  data$!: Observable<ICompany[]>;
  private router = inject(Router);
  private companyService = inject(CompanyService);

  ngOnInit(): void {
    this.fetchstaffList();
  }

  private fetchstaffList(): void {
    console.log('calling fetch list');
    this.data$ = this.companyService.getCompanyList();
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-company'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-company']);
  }
}
