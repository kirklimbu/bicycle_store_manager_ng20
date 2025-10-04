import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ICompany } from '../model/company.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getFormValues(id: number): Observable<ICompany> {
    return this.http.get<ICompany>(`${this.apiUrl}auth/company/form`, {
      params: { companyId: id },
    });
  }

  saveCompany(team: any): Observable<ICustomResponse> {
    console.log('fsdfa', team);

    // return this.http.post<ICustomResponse>(
    //   `${this.apiUrl}auth/event/category/save`,
    //   {
    //     ...qustion,
    //   }
    // );

    const { file, ...teamWithoutDoc } = team; // destructure to remove doc

    const formData = new FormData();
    formData.append('form', JSON.stringify(teamWithoutDoc));
    formData.append('file', team.file);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/company/save`,
      formData
    );
  }

  getCompanyList(): Observable<ICompany[]> {
    return this.http.get<ICompany[]>(`${this.apiUrl}company/list`);
  }
}
