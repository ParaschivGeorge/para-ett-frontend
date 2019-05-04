import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (sessionStorage.getItem('token')) {
      const copiedReq = req.clone({headers: req.headers.append('PARA-ETT-ID', 'Bearer ' + sessionStorage.getItem('token'))});
      return next.handle(copiedReq);
    }
    return next.handle(req);
  }
}
