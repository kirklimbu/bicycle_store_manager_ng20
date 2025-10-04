import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IHome1DtoWrapper, IOrganization } from './data/model/home.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // public homeContents = signal<Home | undefined>({});
  api_url = `${environment.apiUrl}`;

  organization$?: Observable<IOrganization>;

  private http = inject(HttpClient);
  private httpClient: HttpClient;
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private handler: HttpBackend
  ) {
    this.httpClient = new HttpClient(handler);
  }
  // protected state: BehaviorSubject<Home> | undefined;

  getHomeContents(id: string): Observable<IHome1DtoWrapper> {
    // console.log('cuurent page', page);
    return this.http.get<IHome1DtoWrapper>(`${this.api_url}home`, {
      params: { deviceId: id },
    });
  }
  getOrganization(id: string): Observable<IOrganization> {
    this.organization$ = this.http
      .get<any>(`${this.api_url}home`, {
        params: { deviceId: id },
      })
      .pipe(
        map((res) => res.organization), // Extract only organization
        shareReplay(1) // Cache for lifetime of app
      );

    return this.organization$;
  }

  getCategories(query?: any): Observable<any> {
    const params = {
      parentId: query?.parentId ? query.parentId : 0,
    };
    return this.http.get<any[]>(`${this.api_url}category/list`, {
      params: params,
    });
  }
}
