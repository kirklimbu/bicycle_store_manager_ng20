import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { IPayment } from '../../data/models/payment.model';
import { PaymentService } from '../../data/services/payment.services';

@Component({
  selector: 'app-payment-list',
  imports: [CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.scss',
})
export class PaymentList {
  data$!: Observable<any[]>;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  queryParamMapSignal = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  idsSignal = computed(() => ({
    transactionId: Number(this.queryParamMapSignal()?.get('transactionId') ?? 0),
    supplierId: Number(this.queryParamMapSignal()?.get('supplierId') ?? 0),
  }));

  ngOnInit(): void {
    this.fetchList();
  }

  private fetchList(): void {
    console.log('calling fetch list');
    this.data$ = this.paymentService.getPaymentList(
      this.idsSignal().supplierId
    );
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-payment'], {
      queryParams: {
        id: id,
      },
    });
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-payment'], {
      queryParams: {
        supplierId: this.idsSignal().supplierId,
      },
    });
  }
}
