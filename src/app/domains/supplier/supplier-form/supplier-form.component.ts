// angular
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// third-party

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
// project
import { SupplierService } from '../data/services/supplier.services';

import { ISupplierFormDto } from '../data/model/supplier.model';
import { TableOperationsComponent } from '../../shared/ui-common/table-operations/table-operations.component';
import { TableActionButtonsComponent } from '../../shared/ui-common/table-action-buttons/table-action-buttons.component';
import { ICustomResponse } from '../../shared/models/CustomResponse.model';

@Component({
  selector: 'app-supplier-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // third-party
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
    // project
    TableOperationsComponent,
    TableActionButtonsComponent,
  ],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss',
})
export class SupplierFormComponent {
  // props
  form!: FormGroup;
  mode = 'add';

  isSubmitting = signal(false);
  private readonly supplierService = inject(SupplierService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    supplierId: Number(this.queryParamMapSignal()?.get('supplierId') ?? 0),
  }));

  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [''],
      supplierId: [0],
      location: [''],
      mobile1: [''],
      mobile2: [''],
      pan: [],
      email: [''],
      businessName: [''],
      hasActive: [''],
    });
  }

  private fetchDefaultForm() {
    this.isSubmitting.set(true);
    this.supplierService
      .getDefaultForm(this.idsSignal().supplierId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: ISupplierFormDto) => {
        console.log('res:', res);
        this.form.patchValue(res);
        this.isSubmitting.set(false);
      });
  }

  onSave() {
    console.log('form:', this.form.value);

    if (this.form.invalid) {
      this.notification.error('Error', 'Please fill all the required fields');
      return;
    }
    this.isSubmitting.set(true);

    this.supplierService
      .saveSupplier(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.isSubmitting.set(false);

          this.notification.success('Success', res.message);
          this.form.reset();
          this.router.navigate(['auth/list-supplier']);
        },
      });
  }

  onCancel() {
    this.router.navigate(['auth/list-supplier']);
  }
}
