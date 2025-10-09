import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import {
  IPurchaseTransactionFormDtoWrapper,
  ISupplier1Dto,
  ISupplierFormDto,
  ISupplierTransaction1Dto,
} from '../model/supplier.model';
import { environment } from 'src/environments/environment';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  apiUrl = environment.apiUrl + 'auth/';
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

  // public categories: any = computed(() => this.categoryResource.value || []);

  getDefaultForm(id: number): Observable<ISupplierFormDto> {
    return this.http.get<ISupplierFormDto>(
      `${this.apiUrl}supplier/form?supplierId=${id}`
    );
  }

  saveSupplier(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(`${this.apiUrl}supplier/save`, data);
  }

  getSuppliertList(): Observable<ISupplier1Dto[]> {
    return this.http.get<ISupplier1Dto[]>(`${this.apiUrl}supplier/list`);
  }

  // supplier transaction section
  getSupplierTransactionList(
    id: number
  ): Observable<ISupplierTransaction1Dto[]> {
    return this.http.get<ISupplierTransaction1Dto[]>(
      `${this.apiUrl}supplier/transaction/list?supplierId=${id}`
    );
  }

  deleteTransaction(id: number): Observable<ISupplierTransaction1Dto[]> {
    return this.http.delete<ISupplierTransaction1Dto[]>(
      `${this.apiUrl}supplier/transaction/delete?masterId=${id}`
    );
  }

  getSupplierTransactoinDefaultForm(
    id: number,
    masterId: number
  ): Observable<IPurchaseTransactionFormDtoWrapper> {
    return this.http.get<IPurchaseTransactionFormDtoWrapper>(
      `${this.apiUrl}supplier/transaction/form`,
      { params: { supplierId: id, masterId: masterId } }
    );
  }

  saveSupplierTransaction(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}supplier/transaction/save`,
      data
    );
  }
}
