import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LeaveRequest } from '../models/leave-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestsService {

  leaveRequestsServiceUrl = environment.apiUrl + '/requests-service/requests';

  constructor(private http: HttpClient) { }

  createLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.leaveRequestsServiceUrl, leaveRequest);
  }

  getLeaveRequests(companyId: number, managerId: number, userId: number, approved: boolean, minDate: Date, maxDate: Date): Observable<LeaveRequest[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (managerId) {
      queryParam = queryParam.append('managerId', managerId.toString());
    }
    if (userId) {
      queryParam = queryParam.append('userId', userId.toString());
    }
    if (approved) {
      queryParam = queryParam.append('approved', approved.toString());
    }
    if (minDate) {
      queryParam = queryParam.append('minDate', minDate.toString());
    }
    if (maxDate) {
      queryParam = queryParam.append('maxDate', maxDate.toString());
    }
    return this.http.get<LeaveRequest[]>(this.leaveRequestsServiceUrl, {params : queryParam});
  }

  getLeaveRequest(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(this.leaveRequestsServiceUrl + '/' + id);
  }

  updateLeaveRequest(id: number, leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(this.leaveRequestsServiceUrl + '/' + id, leaveRequest);
  }

  deleteLeaveRequest(id: number): Observable<null> {
    return this.http.delete<null>(this.leaveRequestsServiceUrl + '/' + id);
  }

  deleteLeaveRequests(companyId: number, managerId: number, userId: number): Observable<null> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (managerId) {
      queryParam = queryParam.append('managerId', managerId.toString());
    }
    if (userId) {
      queryParam = queryParam.append('userId', userId.toString());
    }
    return this.http.delete<null>(this.leaveRequestsServiceUrl, {params : queryParam});
  }
}
