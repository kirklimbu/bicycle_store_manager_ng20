import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from '../../../../../environments/environment';
import { IPayment, IPaymentFormDtoWrapper } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  //
  apiUrl = environment.apiUrl + 'auth/';
  private readonly http = inject(HttpClient);

  getPaymentList(query?: any): Observable<IPayment[]> {
    return this.http.get<IPayment[]>(
      `${this.apiUrl}transaction/payment/list`,
      { params: query }
    );
  }

  fetchDefaultForm(
    transactionId: number,
    supplierId: number
  ): Observable<IPaymentFormDtoWrapper> {
    return this.http.get<IPaymentFormDtoWrapper>(
      `${this.apiUrl}transaction/payment/form`,
      {
        params: {
          transactionId: transactionId.toString(),
          supplierId: supplierId.toString()
        }
      }
    );
  }
  savePayment(data: any): Observable<ICustomResponse> {

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}transaction/payment/save`,
      { ...data }
    );
  }


}
