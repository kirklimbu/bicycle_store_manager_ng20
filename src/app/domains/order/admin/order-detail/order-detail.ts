import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { Observable, of } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { IOrderApproveFormDtoWrapper } from '../data/models/order.model';
import { OrderService } from '../data/services/order.service';

@Component({
  selector: 'app-order-detail',
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzSelectModule,
    NzFormModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetail implements OnInit {
  // props
  form!: FormGroup;
  data$!: Observable<IOrderApproveFormDtoWrapper>;

  private readonly orderService = inject(OrderService);
  private notification = inject(NzNotificationService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => {
    const queryParamMap = this.queryParamMapSignal();
    return {
      customerId: queryParamMap ? Number(queryParamMap.get('id')) : 0,
      orderById: queryParamMap ? Number(queryParamMap.get('id2')) : 0,
    };
  });

  ngOnInit(): void {
    this.buildForm();
    this.fetchOrderDetails();
  }
  private buildForm(): void {
    this.form = this.fb.group({
      transType: [],
      remarks: [],
      orderList: [],
    });
  }

  fetchOrderDetails() {
    this.orderService
      .getApproveForm(this.idsSignal().customerId, this.idsSignal().orderById)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: IOrderApproveFormDtoWrapper) => {
          this.data$ = of(res);
          this.form.patchValue(res.form);
        },
      });
  }

  isApproved(status: string): boolean {
    return status === 'Approved';
  }

  approveOrder() {
    console.log('form:', this.form.value);
    this.orderService
      .saveApprovedOrder(this.form.value)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: ICustomResponse) => {
          this.notification.success('Success', res.message);
          this.router.navigate(['auth/list-order']);
        },
      });
  }
}
