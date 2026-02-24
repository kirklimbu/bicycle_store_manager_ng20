import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { SupplierService } from '../data/services/supplier.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ICustomResponse } from '../../shared/models/CustomResponse.model';
import { IPaymentFormDtoWrapper } from '../../payment';
import { ISupplierFormDto } from '../data/model/supplier.model';

@Component({
  selector: 'app-supplier-form',
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
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm {
  form!: FormGroup;

  private readonly supplierService = inject(SupplierService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  isSubmitting = signal(false);

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
      supplierId: [0], // Default 0 for new suppliers
      businessName: [''],
      pan: [''], // Example 9-digit PAN validation
      name: [''],
      email: [''],
      mobile1: [''],
      mobile2: [''],
      location: ['']
    });
  }


  private fetchDefaultForm() {
    const { supplierId } = this.idsSignal();
    this.supplierService
      .getDefaultForm(supplierId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: ISupplierFormDto) => {
        console.log('res:', res);
        this.form.patchValue(res.form);
        // this.supplierListSignal.set(res.supplier);
        // this.payTypeListSignal.set(res.payTypeList);
      });
  }

  onSave() {
    console.log('form:', this.form.value);
    this.isSubmitting.set(true);

    this.supplierService.saveSupplier(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.isSubmitting.set(false);
          this.notification.success('Success', res.message);
          this.form.reset();
          this.router.navigate(['auth/list-supplier'], {
          });
        },
      });
  }


}
