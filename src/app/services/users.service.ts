import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AccountActivationUserDto } from '../models/account-activation-user-dto';
import { MassRegisterUserDto } from '../models/mass-register-user-dto';
import { OwnerRegisterUserDto } from '../models/owner-register-user-dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersServiceUrl = environment.apiUrl + '/users-service/users';

  constructor(private http: HttpClient) { }

  getAllUsers(companyId: number, managerId: number): Observable<User[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (managerId) {
      queryParam = queryParam.append('managerId', managerId.toString());
    }
    return this.http.get<User[]>(this.usersServiceUrl, {params : queryParam});
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.usersServiceUrl + '/' + id);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(this.usersServiceUrl + '/email/' + email);
  }

  updateUser(id: number, user: User): Observable<User> {
    user.projects = [];
    return this.http.put<User>(this.usersServiceUrl + '/' + id, user);
  }

  deleteUser(id: number): Observable<null> {
    return this.http.delete<null>(this.usersServiceUrl + '/' + id);
  }

  deleteUsers(companyId: number): Observable<null> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.delete<null>(this.usersServiceUrl, {params : queryParam});
  }

  activateAccount(accountActivationUserDto: AccountActivationUserDto): Observable<User> {
    return this.http.put<User>(this.usersServiceUrl + '/activateAccount', accountActivationUserDto);
  }

  massRegister(companyId: number, massRegisterUserDtoList: MassRegisterUserDto[]): Observable<User[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.post<User[]>(this.usersServiceUrl + '/massRegister', massRegisterUserDtoList, {params : queryParam});
  }

  registerOwner(companyId: number, ownerRegisterUserDto: OwnerRegisterUserDto): Observable<User> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.post<User>(this.usersServiceUrl + '/registerOwner', ownerRegisterUserDto, {params : queryParam});
  }
}
