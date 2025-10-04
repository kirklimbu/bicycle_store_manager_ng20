import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from '../../../../../environments/environment';
import { ICompany } from 'src/app/domains/company/data/model/company.model';
import { ICustomer } from './model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getFormValues(id: number): Observable<ICompany> {
    return this.http.get<ICompany>(`${this.apiUrl}auth/customer/form`, {
      params: { customerId: id },
    });
  }

  saveCustomer(payload: ICustomer): Observable<ICustomResponse> {
    console.log('fsdfa', payload);

    // return this.http.post<ICustomResponse>(
    //   `${this.apiUrl}auth/event/category/save`,
    //   {
    //     ...qustion,
    //   }
    // );

    return this.http.post<ICustomResponse>(`${this.apiUrl}auth/customer/save`, {
      ...payload,
    });
  }

  getCustomerList(): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(`${this.apiUrl}auth/customer/list`);
  }
}
