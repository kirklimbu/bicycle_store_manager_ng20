import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@logger/message.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CustomerService } from '../../data/services/customer-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-add-customer',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzSelectModule,
    NzDividerModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzPageHeaderModule,
    NzBreadCrumbModule,
    NzSpaceModule,
    NzModalModule,
    NzUploadModule,
    NzIconModule,
    NzCheckboxModule,
    NzSwitchModule,
  ],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.scss',
})
export class AddCustomer {
  // props
  form!: FormGroup;
  mode = 'add';
  isSubmitting = signal(false);

  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);
  private notification = inject(NzNotificationService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    id: Number(this.queryParamMapSignal()?.get('id') ?? 0),
  }));

  public ngOnInit(): void {
    this.buildForm();
    this.fetchDefaultFormValues();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      customerId: [],
      name: [],
      mobile1: [''],
      mobile2: [''],
      email: [''],
      location: [''],
      pan: [''],
      hasActive: [],
      businessName: [],
    });
  }

  fetchDefaultFormValues() {
    this.isSubmitting.set(true);

    this.customerService
      .getFormValues(this.idsSignal().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_res) => {
        console.log('res form', _res);
        this.form.patchValue(_res);
        this.isSubmitting.set(false);
      });
  }

  onSave() {

    if (this.form.invalid) {
      this.notification.error('Error', 'Please fill all the required fields');
      return;
    }
    this.isSubmitting.set(true);

    this.customerService
      .saveCustomer(this.form.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.isSubmitting.set(false);
        this.messageService.createMessage('success', res.message);
        this.router.navigate(['auth/list-customer']);
      });
  }

  onCancel() {
    this.router.navigate(['/auth/list-customer']);
  }
}
