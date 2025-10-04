import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
// project
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'src/environments/environment';

import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { ICart, ICheckOutFormDtoWrapper } from '../model/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  apiUrl = environment.apiUrl + 'auth/';
  // apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  fetchCartItems(): Observable<ICart[]> {
    return this.http.get<ICart[]>(`${this.apiUrl}cart/list`);
  }

  getSalesList(query: any): Observable<ICart[]> {
    return this.http.get<ICart[]>(`${this.apiUrl}sales/list`, {
      params: query,
    });
  }

  fetchDefaultForm(): Observable<ICheckOutFormDtoWrapper> {
    return this.http.get<ICheckOutFormDtoWrapper>(
      `${this.apiUrl}order/checkout/form`
    );
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Saves the cart data
   * @param data The cart data to be saved
   * @returns An observable containing the saved cart data
   */
  /*******  86d7f8c3-2f94-4d3d-9f17-d894153d24fc  *******/
  saveCart(data: ICart): Observable<ICart> {
    return this.http.post<ICart>(`${this.apiUrl}cart/save`, data);
  }
  saveCheckout(data: any): Observable<ICustomResponse> {
    console.log('checout data', data);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}order/checkout/save`,
      {
        ...data,
      }
    );
  }

  // sales return
  // fetchSalesReturnForm(
  //   id: number,
  //   customerId: number
  // ): Observable<ICartReturnFormDtoWrapper> {
  //   return this.http.get<ICartReturnFormDtoWrapper>(
  //     `${this.apiUrl}sales/return/form`,
  //     { params: { masterId: id, customerId: customerId } }
  //   );
  // }
  // saveSalesReturn(data: any): Observable<ICustomResponse> {
  //   return this.http.post<ICustomResponse>(
  //     `${this.apiUrl}sales/return/save`,
  //     data
  //   );
  // }
}
