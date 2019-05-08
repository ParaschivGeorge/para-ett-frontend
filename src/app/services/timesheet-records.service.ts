import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TimesheetRecord } from '../models/timesheet-record';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimesheetRecordsService {

  timesheetRecordsServiceUrl = environment.apiUrl + '/timesheet-records-service/timesheet-records';

  constructor(private http: HttpClient) { }

  createTimesheetRecords(timesheetRecords: TimesheetRecord[]): Observable<TimesheetRecord[]> {
    return this.http.post<TimesheetRecord[]>(this.timesheetRecordsServiceUrl, timesheetRecords);
  }

  getTimesheetRecords(companyId: number, projectId: number, userId: number, minDate: Date, maxDate: Date): Observable<TimesheetRecord[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (projectId) {
      queryParam = queryParam.append('projectId', projectId.toString());
    }
    if (userId) {
      queryParam = queryParam.append('userId', userId.toString());
    }
    if (minDate) {
      queryParam = queryParam.append('minDate', minDate.toString());
    }
    if (maxDate) {
      queryParam = queryParam.append('maxDate', maxDate.toString());
    }
    return this.http.get<TimesheetRecord[]>(this.timesheetRecordsServiceUrl, {params : queryParam});
  }

  getTimesheetRecord(id: number): Observable<TimesheetRecord> {
    return this.http.get<TimesheetRecord>(this.timesheetRecordsServiceUrl + '/' + id);
  }

  updateTimesheetRecord(id: number, timesheetRecord: TimesheetRecord): Observable<TimesheetRecord> {
    return this.http.put<TimesheetRecord>(this.timesheetRecordsServiceUrl + '/' + id, timesheetRecord);
  }

  deleteTimesheetRecord(id: number): Observable<null> {
    return this.http.delete<null>(this.timesheetRecordsServiceUrl + '/' + id);
  }

  deleteTimesheetRecords(companyId: number, userId: number): Observable<null> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (userId) {
      queryParam = queryParam.append('userId', userId.toString());
    }
    return this.http.delete<null>(this.timesheetRecordsServiceUrl, {params : queryParam});
  }
}
