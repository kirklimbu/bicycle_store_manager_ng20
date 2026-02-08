import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from '../../../../../environments/environment';
import {
  IProduct,
  IProductFormDtoWrapper,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //
  apiUrl = environment.apiUrl + 'auth/';
  private readonly http = inject(HttpClient);

  getProductList(query?: any): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(
      `${this.apiUrl}product/list`,
      { params: query }
    );
  }

  fetchDefaultForm(
    id1: number,
  ): Observable<IProductFormDtoWrapper> {
    return this.http.get<IProductFormDtoWrapper>(
      `${this.apiUrl}product/form`,
      { params: { productId: id1 } }
    );
  }

  saveProduct(data: any): Observable<ICustomResponse> {
    // return this.http.post<ICustomResponse>(`${this.apiUrl}prodcut/save`, data);
    const { file, ...teamWithoutDoc } = data; // destructure to remove doc

    const formData = new FormData();
    formData.append('form', JSON.stringify(teamWithoutDoc));
    formData.append('file', data.file);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}product/save`,
      formData
    );
  }


}
