import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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
import { ISupplier, IPaytype } from '../../../purchase/data/models/purhase.model';
import { ICustomResponse } from '../../../shared/models/CustomResponse.model';
import { IPaymentFormDtoWrapper } from '../../data/models/payment.model';
import { PaymentService } from '../../data/services/payment.services';

@Component({
  selector: 'app-payment-entry-form',
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
  templateUrl: './payment-entry-form.html',
  styleUrl: './payment-entry-form.scss',
})
export class PaymentEntryForm {
  form!: FormGroup;
  mode = 'add';
  loading = false;

  supplierListSignal = signal<ISupplier | null>(null);
  payTypeListSignal = signal<IPaytype[]>([]);

  private readonly paymentService = inject(PaymentService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    transactionId: Number(this.queryParamMapSignal()?.get('transactionId') ?? 0),
    supplierId: Number(this.queryParamMapSignal()?.get('supplierId') ?? 0),

  }));
  ngOnInit(): void {
    this.initForm();
    this.fetchDefaultForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      transactionId: [0],
      supplierId: [0],
      transAmt: [''],
      payTypeId: [],
      remarks: [],
    });
  }

  private fetchDefaultForm() {
    const { transactionId, supplierId } = this.idsSignal();
    this.paymentService
      .fetchDefaultForm(transactionId, supplierId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res: IPaymentFormDtoWrapper) => {
        console.log('res:', res);
        this.form.patchValue(res.form);
        this.supplierListSignal.set(res.supplier);
        this.payTypeListSignal.set(res.payTypeList);
      });
  }

  onSave() {
    console.log('form:', this.form.value);

    this.paymentService
      .savePayment(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.notification.success('Success', res.message);
          this.form.reset();
          this.router.navigate(['auth/list-payment'], {
            queryParams: {
              supplierId: this.idsSignal().supplierId,
            },
          });
        },
      });
  }
}
