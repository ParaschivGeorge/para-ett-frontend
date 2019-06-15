import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataHolderService } from '../services/data-holder.service';
import { UsersService } from '../services/users.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private dataHolderService: DataHolderService,
    private usersService: UsersService,
    private router: Router) {};

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const token = sessionStorage.getItem('token');
      if (!token) {
        return false;
      } else {
        if (this.dataHolderService.user) {
          if (next.data.roles) {
            const roles = next.data.roles as string[];
            if (roles.find(role => role.toLowerCase() === this.dataHolderService.user.type.toLowerCase())) {
              return true;
            } else {
              this.router.navigateByUrl('timesheet-records');
              return false;
            }
          } else {
            return true;
          }
        } else {
          this.dataHolderService.loading = true;
          this.usersService.getUserByEmail(JSON.parse(jwt_decode(token).sub).username).subscribe(
            user => {
              console.log(user);
              this.dataHolderService.user = user;
              this.router.navigateByUrl(state.url);
            },
            error => {
              sessionStorage.removeItem('token');
              this.router.navigateByUrl('start');
            }
          ).add(() => {
            this.dataHolderService.loading = false;
          });
        }
      }
  }

}
