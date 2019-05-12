import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    // TODO provide user company id
    this.usersService.getAllUsers(null, null).subscribe(
      users => {
        this.users = users;
        console.log(users);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(
      data => {
        console.log(data);
        this.getUsers();
      },
      error => {
        console.log(error);
      }
    );
  }

}
