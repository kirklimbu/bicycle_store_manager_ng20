import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ICategory } from '../model/category.model';
import { ICustomResponse } from 'src/app/domains/shared/models/CustomResponse.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCategoryFormValues(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}auth/category/form`, {
      params: { categoryId: id },
    });
  }

  saveCategory(team: any): Observable<ICustomResponse> {
    console.log('fsdfa', team);

    const { path, ...teamWithoutDoc } = team; // destructure to remove doc

    const formData = new FormData();
    formData.append('form', JSON.stringify(teamWithoutDoc));
    formData.append('file', team.path);

    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/category/save`,
      formData
    );
  }

  getCategoryList(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}category/list`);
  }

  saveEvent(qustion: any) {
    console.log('fsdfa', qustion);

    return this.http.post<any>(`${this.apiUrl}auth/event/save`, { ...qustion });
  }

  // admin

  getAdminCategoryList(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}auth/category/list`);
  }
}
