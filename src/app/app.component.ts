import { Component, OnInit } from '@angular/core';
import { DataHolderService } from './services/data-holder.service';
import { UsersService } from './services/users.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'para-ett-frontend';

  constructor(
    private dataHolderService: DataHolderService,
    private usersService: UsersService) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log('here');
      this.usersService.getUserByEmail(JSON.parse(jwt_decode(token).sub).username).subscribe(
        user => {
          console.log(user);
          this.dataHolderService.user = user;
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
