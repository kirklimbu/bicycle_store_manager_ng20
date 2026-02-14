import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { IPurchaseReport } from '../models/purhase-report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  //


  apiUrl = environment.apiUrl + 'auth/';
  private readonly http = inject(HttpClient);

  getPurchaseReportList(query: any): Observable<IPurchaseReport[]> {
    return this.http.get<IPurchaseReport[]>(
      `${this.apiUrl}report/purchase/list`,
      { params: query }
    );
  }

  // fetchDefaultForm(
  //   id1: number,
  //   id2: number
  // ): Observable<IPurchaseFormDtoWrapper> {
  //   return this.http.get<IPurchaseFormDtoWrapper>(
  //     `${this.apiUrl}purchase/form`,
  //     { params: { purchaseMasterId: id1, supplierId: id2 } }
  //   );
  // }

  savePurchase(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(`${this.apiUrl}purchase/save`, data);
  }

  // transaction section

  // fetchTransactionForm(
  //   id: number
  // ): Observable<PurchaseTransactionFormDtoWrapper> {
  //   return this.http.get<PurchaseTransactionFormDtoWrapper>(
  //     `${this.apiUrl}supplier/transaction/form`,
  //     { params: { masterId: id } }
  //   );
  // }


  private buildHttpParams(params: { [key: string]: unknown }): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }
}
