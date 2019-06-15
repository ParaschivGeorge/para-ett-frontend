import { Component, OnInit } from '@angular/core';
import { DataHolderService } from './services/data-holder.service';
import { UsersService } from './services/users.service';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'para-ett-frontend';

  constructor(
    private dataHolderService: DataHolderService,
    private usersService: UsersService,
    private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log('token is present, getting user...');
      this.dataHolderService.loading = true;
      this.usersService.getUserByEmail(JSON.parse(jwt_decode(token).sub).username).subscribe(
        user => {
          console.log(user);
          this.dataHolderService.user = user;
          const currentUrl = JSON.parse(JSON.stringify(this.router.url));
          console.log(this.router.url);
          this.router.navigateByUrl('/refresh', {skipLocationChange: true}).then(() =>
          this.router.navigateByUrl(currentUrl));
        },
        error => {
          sessionStorage.removeItem('token');
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    }
    }
}
