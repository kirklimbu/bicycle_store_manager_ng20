import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from 'src/environments/environment';
import {
  IOrder,
  IOrderApproveFormDto,
  IOrderApproveFormDtoWrapper,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // public homeContents = signal<Home | undefined>({});
  apiUrl = `${environment.apiUrl}auth/`;

  private http = inject(HttpClient);

  getorderList(): Observable<IOrder[]> {
    // console.log('cuurent page', page);
    return this.http.get<IOrder[]>(`${this.apiUrl}order/list`, {});
  }

  saveOrder(payload: any): Observable<ICustomResponse> {
    console.log('fsdfa', payload);

    // return this.http.post<ICustomResponse>(
    //   `${this.apiUrl}auth/event/category/save`,
    //   {
    //     ...qustion,
    //   }
    // );

    // const { file, ...teamWithoutDoc } = team; // destructure to remove doc

    // const formData = new FormData();
    // formData.append('form', JSON.stringify(teamWithoutDoc));
    // formData.append('file', team.file);

    return this.http.post<ICustomResponse>(`${this.apiUrl}company/save`, {
      ...payload,
    });
  }

  // order detail list
  getApproveForm(
    id: number,
    id2: number
  ): Observable<IOrderApproveFormDtoWrapper> {
    console.log('cuurent page', id);
    return this.http.get<IOrderApproveFormDtoWrapper>(
      `${this.apiUrl}order/approve/form`,
      {
        params: { customerId: id, orderById: id2 },
      }
    );
  }

  saveApprovedOrder(
    payload: IOrderApproveFormDto
  ): Observable<ICustomResponse> {
    console.log('fsdfa', payload);
    return this.http.post<ICustomResponse>(`${this.apiUrl}order/approve/save`, {
      ...payload,
    });
  }
}
