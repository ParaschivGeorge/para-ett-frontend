import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataHolderService } from '../services/data-holder.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate  {
  
  constructor(private router: Router, private dataHolderService: DataHolderService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const token = sessionStorage.getItem('token');
      if (!token) {
        return true;
      } else {
        this.router.navigate(['users']);
        return false;
      }
    }
}
