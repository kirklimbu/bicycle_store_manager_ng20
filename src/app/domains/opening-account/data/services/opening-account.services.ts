import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';
import { environment } from '../../../../../environments/environment';
import { IOpeningFormDtoWrapper } from '../models/opening.model';


@Injectable({
  providedIn: 'root',
})
export class OpeningService {
  //
  apiUrl = environment.apiUrl + 'auth/';
  private readonly http = inject(HttpClient);

  categoryId: WritableSignal<number> = signal(0);



  fetchDefaultForm(
    id1: number,

  ): Observable<IOpeningFormDtoWrapper> {
    return this.http.get<IOpeningFormDtoWrapper>(
      `${this.apiUrl}opening/form`,
      { params: { purchaseMasterId: id1 } }
    );
  }

  saveOpening(data: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(`${this.apiUrl}opening/save`, data);
  }

  // transaction section

}
