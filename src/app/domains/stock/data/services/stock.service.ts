import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from 'src/environments/environment';
import {
  IStock,
  IStockDetailDto,
  IStockDetailFormDto,
  IStockForm2DtoWrapper,
  IStockFormDtoWrapper,
} from '../model/stock';
import { IProduct } from 'src/app/domains/home/data/model/home.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {



  apiUrl = `${environment.apiUrl}auth/`;
  private http = inject(HttpClient);

  getDefaultForm(id: number): Observable<IStockFormDtoWrapper> {
    return this.http.get<IStockFormDtoWrapper>(`${this.apiUrl}stock/form`, {
      params: { stockMasterId: id },
    });
  }

  getStockList(query?: any): Observable<IStock[]> {
    // const params = {
    //   parentId: query?.parentId ? query.parentId : 0,
    // };
    return this.http.get<IStock[]>(`${this.apiUrl}stock/list`);
  }

  saveStock(data: any): Observable<ICustomResponse> {
    // return this.http.post<ICustomResponse>(`${this.apiUrl}stock/save`, data);

    const { file, ...teamWithoutDoc } = data; // destructure to remove doc

    const formData = new FormData();
    formData.append('form', JSON.stringify(teamWithoutDoc));
    formData.append('file', data.file);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}stock/save`,
      formData
    );
  }
  // stock-2
  getDefaultForm2(id: number): Observable<IStockForm2DtoWrapper> {
    return this.http.get<IStockForm2DtoWrapper>(`${this.apiUrl}stock/form2`, {
      params: { stockMasterId: id },
    });
  }

  saveStock2(data: any): Observable<ICustomResponse> {
    // return this.http.post<ICustomResponse>(`${this.apiUrl}stock/save`, data);



    return this.http.post<ICustomResponse>(
      `${this.apiUrl}stock/save2`,
      { ...data },
    );
  }
  // stock-detail section
  getStockDetailForm(id: number): Observable<IStockDetailFormDto> {
    return this.http.get<IStockDetailFormDto>(
      `${this.apiUrl}stock/detail/form`,
      {
        params: { stockMasterId: id },
      }
    );
  }

  getStockDetailList(id: number): Observable<IStockDetailDto[]> {
    return this.http.get<IStockDetailDto[]>(`${this.apiUrl}stock/detail/list`, {
      params: { stockMasterId: id },
    });
  }

  saveStockDetail(payload: any): Observable<ICustomResponse> {
    // return this.http.post<ICustomResponse>(`${this.apiUrl}stock/save`, data);

    return this.http.post<ICustomResponse>(`${this.apiUrl}stock/detail/save`, {
      ...payload,
    });
  }
}
