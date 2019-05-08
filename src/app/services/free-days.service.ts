import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FreeDay } from '../models/free-day';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreeDaysService {

  freeDaysServiceUrl = environment.apiUrl + '/free-days-service/free-days';

  constructor(private http: HttpClient) { }

  createFreeDays(freeDays: FreeDay[]): Observable<FreeDay[]> {
    return this.http.post<FreeDay[]>(this.freeDaysServiceUrl, freeDays);
  }

  getFreeDays(companyId: number): Observable<FreeDay[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.get<FreeDay[]>(this.freeDaysServiceUrl, {params : queryParam});
  }

  getFreeDay(id: number): Observable<FreeDay> {
    return this.http.get<FreeDay>(this.freeDaysServiceUrl + '/' + id);
  }

  updateFreeDay(id: number, freeDay: FreeDay): Observable<FreeDay> {
    return this.http.put<FreeDay>(this.freeDaysServiceUrl + '/' + id, freeDay);
  }

  deleteFreeDay(id: number): Observable<null> {
    return this.http.delete<null>(this.freeDaysServiceUrl + '/' + id);
  }

  deleteFreeDays(companyId: number): Observable<null> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.delete<null>(this.freeDaysServiceUrl, {params : queryParam});
  }
}
