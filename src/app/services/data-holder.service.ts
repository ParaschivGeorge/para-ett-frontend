import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHolderService {
  loading =  false;
  email: string = null;
  private _user: User;
  userSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }
}
