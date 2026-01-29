import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
// project
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from 'src/environments/environment';
import // ISalesFormDtoWrapper,

  // ISales,
  '../models/sales.model';
import { ISales, ISalesMasterDto, ISalesReturnFormDtoWrapper } from '../models/sales.model';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  apiUrl = environment.apiUrl + 'auth/';
  // apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  categoryId: WritableSignal<number> = signal(0);

  // categoryResource = resource({
  //     // request: () => ({ id: this.categoryId() }),
  //     loader: async (param) => {
  //         console.log('categoryResource', param, `${this.apiUrl}`);

  //         // const { id } = param.request as { id: number };
  //         let url = `${this.apiUrl}category/list`;
  //         return fetch(url).then((res) => res.json() as Promise<ICategory[]>);
  //     },

  // })

  getSalesList(query: any): Observable<ISales[]> {
    return this.http.get<ISales[]>(`${this.apiUrl}report/sales/list`, {
      params: query,
    });
  }

  fetchDefaultForm(
    customerId: number,
    salesMasterId: number
  ): Observable<ICustomResponse> {
    const params: Record<string, string> = {
      salesMasterId: String(salesMasterId),
      customerId: String(customerId),
    };
    return this.http.get<ICustomResponse>(`${this.apiUrl}sales/form2`, {
      params,
    });
  }

  saveSales(data: any): Observable<ISales> {
    return this.http.post<ISales>(`${this.apiUrl}sales/save2`, data);
  }

  // sales return
  fetchSalesReturnForm(
    salesRetMasterId: number,
    salesMasterId: number,
    customerId: number
  ): Observable<ISalesReturnFormDtoWrapper> {
    const params: Record<string, string> = {
      salesRetMasterId: String(salesRetMasterId),
      salesMasterId: String(salesMasterId),
    };

    if (customerId !== undefined) {
      params['purRetMasterId'] = String(customerId);
    }
    return this.http.get<ISalesReturnFormDtoWrapper>(
      `${this.apiUrl}sales/return/form`,
      {
        params,
      }
    );
  }
  saveSalesReturn(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}sales/return/save`,
      data
    );
  }

  getSalesMasterList(query: any): Observable<ISalesMasterDto[]> {
    return this.http.get<ISalesMasterDto[]>(
      `${this.apiUrl}sales/master/list`,
      { params: query }
    );
  }
}
