import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ICartCountDto } from './../model/cart.model';
// project
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'src/environments/environment';

import { IProduct } from 'src/app/domains/home/data/model/home.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import {
  ICart,
  ICartDeleteResponseDto,
  ICheckOutFormDtoWrapper,
} from '../model/cart.model';
import { AuthState } from 'src/app/domains/auth/login/state/login.state';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  apiUrl = environment.apiUrl + 'auth/';
  // apiUrl = environment.apiUrl;

  private readonly _cartCount = signal<number>(0);
  readonly cartCount = this._cartCount.asReadonly();

  private readonly http = inject(HttpClient);
  private readonly authstate = inject(AuthState);

  constructor() {
    // Fetch cart count at startup
    const authenticated = this.authstate.isAuthenticated();
    if (authenticated) this.refreshCartCount();
  }

  fetchCartItems(): Observable<ICart[]> {
    return this.http.get<ICart[]>(`${this.apiUrl}cart/list`);
  }

  getCartList(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}cart/list`);
  }

  fetchCheckoutForm(): Observable<ICheckOutFormDtoWrapper> {
    return this.http.get<ICheckOutFormDtoWrapper>(
      `${this.apiUrl}order/checkout/form`
    );
  }

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

  deleteItem(id: number): Observable<ICartDeleteResponseDto> {
    return this.http.delete<ICartDeleteResponseDto>(
      `${this.apiUrl}cart/delete`,
      { params: { stockMasterId: id } }
    );
  }
  deleteAllItem(): Observable<ICartDeleteResponseDto> {
    return this.http.delete<ICartDeleteResponseDto>(
      `${this.apiUrl}cart/delete/all`
    );
  }
  fetchCartCount(): Observable<ICartCountDto> {
    return this.http
      .get<ICartCountDto>(`${this.apiUrl}cart/count`)
      .pipe(tap((res) => this._cartCount.set(res.count)));
  }

  refreshCartCount() {
    this.fetchCartCount().subscribe();
  }
  updateCartAfterCheckout(): void {
    this.refreshCartCount();
  }
}
