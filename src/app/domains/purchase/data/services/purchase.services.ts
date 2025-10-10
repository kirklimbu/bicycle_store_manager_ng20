import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import {
  IPurchaseFormDtoWrapper,
  IPurchaseTransaction1Dto,
} from '../models/purhase.model';
import {
  IPurchaseTransactionFormDto,
  PurchaseTransactionFormDtoWrapper,
} from '../models/transaction.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  //
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

  getPurchaseList(query: any): Observable<IPurchaseTransaction1Dto[]> {
    return this.http.get<IPurchaseTransaction1Dto[]>(
      `${this.apiUrl}purchase/list`,
      { params: query }
    );
  }

  fetchDefaultForm(
    id1: number,
    id2: number
  ): Observable<IPurchaseFormDtoWrapper> {
    return this.http.get<IPurchaseFormDtoWrapper>(
      `${this.apiUrl}purchase/form`,
      { params: { purchaseMasterId: id1, supplierId: id2 } }
    );
  }

  savePurchase(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(`${this.apiUrl}purchase/save`, data);
  }

  // transaction section

  fetchTransactionForm(
    id: number
  ): Observable<PurchaseTransactionFormDtoWrapper> {
    return this.http.get<PurchaseTransactionFormDtoWrapper>(
      `${this.apiUrl}supplier/transaction/form`,
      { params: { masterId: id } }
    );
  }

  saveTransaction(
    data: IPurchaseTransactionFormDto
  ): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}supplier/transaction/save`,
      data
    );
  }

  // purchase return section
  fetchPurchaseReturnDefaultForm(
    id: number,
    supplierId: number
  ): Observable<IPurchaseFormDtoWrapper> {
    return this.http.get<IPurchaseFormDtoWrapper>(
      `${this.apiUrl}purchase/return/form`,
      { params: { masterId: id, supplierId: supplierId } }
    );
  }

  savePurchaseReturn(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}purchase/return/save`,
      data
    );
  }
}
