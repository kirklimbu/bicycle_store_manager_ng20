import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { IStockDetailFormDto } from '../../../data/model/stock';
import { StockService } from '../../../data/services/stock.service';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';

@Component({
  selector: 'app-add-stock-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSelectModule,
    NzTableModule,
    NzDividerModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSwitchModule,
    NzSpaceModule,
    NzCardModule,
    NzBadgeModule,
    NzUploadModule,
    NzFormModule,
  ],
  templateUrl: './add-stock-detail.html',
  styleUrl: './add-stock-detail.scss',
})
export class AddStockDetail {
  form!: FormGroup;
  mode = 'add';
  loading = false;

  private readonly stockService = inject(StockService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    id: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      stockMasterId: [0],
      costPerUnit: [0],
      saveDate: [''],
      qty: [],
      remarks: [],
    });
  }

  private fetchDefaultForm() {
    this.stockService
      .getStockDetailForm(this.idsSignal().id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: IStockDetailFormDto) => {
        console.log('res:', res);
        this.form.patchValue(res);
      });
  }

  onSave() {
    console.log('form:', this.form.value);

    this.stockService
      .saveStockDetail(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.notification.success('Success', res.message);
          this.form.reset();
          this.router.navigate(['auth/list-stock-detail'], {
            queryParams: {
              id: this.idsSignal().id,
            },
          });
        },
      });
  }
}
