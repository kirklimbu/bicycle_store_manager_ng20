import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { IClosingStockReport, IPurchaseDetailReport, IPurchaseMasterReport, IPurchaseReport, ISalesDetailReport } from '../models/purhase-report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  //


  apiUrl = environment.apiUrl + 'auth/';
  private readonly http = inject(HttpClient);

  getPurchaseMasterReportList(query: any): Observable<IPurchaseMasterReport[]> {
    return this.http.get<IPurchaseMasterReport[]>(
      `${this.apiUrl}report/purchase/master/list`,
      { params: query }
    );
  }

  getPurchaseReportList(query: any): Observable<IPurchaseReport[]> {
    return this.http.get<IPurchaseReport[]>(
      `${this.apiUrl}report/purchase/list`,
      { params: query }
    );
  }

  getPurchaseDetailReportList(id: number): Observable<IPurchaseDetailReport[]> {
    return this.http.get<IPurchaseDetailReport[]>(
      `${this.apiUrl}report/purchase/detail/list?purchaseMasterId=${id}`,

    );
  }

  savePurchase(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(`${this.apiUrl}purchase/save`, data);
  }

  // sales report

  getSalesReportList(query: any): Observable<ISalesDetailReport[]> {
    return this.http.get<ISalesDetailReport[]>(
      `${this.apiUrl}report/sales/list`,
      { params: query }
    );
  }

  getSalesMasterReportList(query: any): Observable<ISalesDetailReport[]> {
    return this.http.get<ISalesDetailReport[]>(
      `${this.apiUrl}report/sales/master/list`,
      { params: query }
    );
  }

  getSalesDetailReportList(id: number): Observable<ISalesDetailReport[]> {
    return this.http.get<ISalesDetailReport[]>(
      `${this.apiUrl}report/sales/detail/list?salesMasterId=${id}`,
    );
  }


  getClosingStockReportList(): Observable<IClosingStockReport[]> {
    return this.http.get<IClosingStockReport[]>(
      `${this.apiUrl}report/closing/stock/list`,
    );
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
