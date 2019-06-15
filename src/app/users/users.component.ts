import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { DataHolderService } from '../services/data-holder.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  displayedColumnsDesktop: string[] = ['email', 'firstName', 'lastName', 'type', 'freeDaysLeft', 'norm'];
  displayedColumnsMobile: string[] = ['email', 'firstName', 'lastName'];
  dataSource = null;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private dataHolderService: DataHolderService,
    private router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUsers() {
    this.dataHolderService.loading = true;
    this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
      users => {
        this.users = users;
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.sort = this.sort;
        console.log(users);
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.dataHolderService.loading = false;
    });
  }
}
