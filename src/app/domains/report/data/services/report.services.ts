import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { IClosingStockReport, IProfitLossReport, IPurchaseDetailReport, IPurchaseMasterReport, IPurchaseReport, IPurchaseReportMonthWise, ISalesDetailReport, ISalesReportMonthWise } from '../models/purhase-report.model';

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

  getPurchaseReportStockWiseList(query: any): Observable<IPurchaseReport[]> {
    return this.http.get<IPurchaseReport[]>(
      `${this.apiUrl}report/purchase/stockwise/list`,
      { params: query }
    );
  }
  getPurchaseReportMonthWise(query: any): Observable<IPurchaseReportMonthWise[]> {
    return this.http.get<IPurchaseReportMonthWise[]>(
      `${this.apiUrl}report/purchase/monthwise/list`,
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
      `${this.apiUrl}report/sales/stockwise/list`,
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
  getProfitLossReportList(query: any): Observable<IProfitLossReport[]> {
    return this.http.get<IProfitLossReport[]>(
      `${this.apiUrl}report/profitloss`,
      { params: query }

    );
  }
  getSalesReportMonthWise(query: any): Observable<ISalesReportMonthWise[]> {
    return this.http.get<ISalesReportMonthWise[]>(
      `${this.apiUrl}report/sales/monthwise/list`,
      { params: query }

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
