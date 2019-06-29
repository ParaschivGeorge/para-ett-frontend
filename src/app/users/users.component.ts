import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { DataHolderService } from '../services/data-holder.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { TimesheetRecordsService } from '../services/timesheet-records.service';
import { LeaveRequestsService } from '../services/leave-requests.service';
import { FreeDaysService } from '../services/free-days.service';
import { TimesheetRecord } from '../models/timesheet-record';
import { FreeDay } from '../models/free-day';
import { LeaveRequest } from '../models/leave-request';
import { FormControl } from '@angular/forms';

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

  timesheetRecords: TimesheetRecord[] = [];
  freeDays: FreeDay[] = [];
  leaveRequests: LeaveRequest[] = [];

  today = new Date();
  year: number = this.today.getFullYear();
  month: number = this.today.getMonth();
  monthsNumbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthFormControl: FormControl = new FormControl(this.month);

  loadingRequests = 0;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private timesheetRecordsService: TimesheetRecordsService,
    private leaveRequestsService: LeaveRequestsService,
    private freeDaysService: FreeDaysService,
    private dataHolderService: DataHolderService,
    private router: Router) { }

  ngOnInit() {
    this.getUsers();

    if (this.isOwnerOrHr()) {
      this.monthFormControl.valueChanges.subscribe(value => {
        this.month = this.monthFormControl.value;
        console.log(this.month);
      });
      this.getTimesheetRecords();
      this.getLeaveRequests();
      this.getFreeDays();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUsers() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
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
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  isOwnerOrHr(): boolean {
    return this.dataHolderService.user && (this.dataHolderService.user.type === 'HR' || this.dataHolderService.user.type === 'OWNER');
  }

  getTimesheetRecords() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.timesheetRecordsService.getTimesheetRecords(
      this.dataHolderService.user.companyId,
      null,
      null,
      new Date(this.year, this.month, 0),
      new Date(this.year, this.month + 1, 1)
    ).subscribe(
      timesheetRecords => {
        this.timesheetRecords = timesheetRecords;
        console.log(timesheetRecords);
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  getLeaveRequests() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.leaveRequestsService.getLeaveRequests(
      this.dataHolderService.user.companyId,
      null,
      null,
      'APPROVED',
      null,
      null
      ).subscribe(
        leaveRequests => {
          this.leaveRequests = leaveRequests;
          console.log(leaveRequests);
        },
        error => {
          console.log(error);
        }
      ).add(() => {
        this.loadingRequests--;
        if (this.loadingRequests === 0) {
          this.dataHolderService.loading = false;
        }
      });
  }

  getFreeDays() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.freeDaysService.getFreeDays(this.dataHolderService.user.companyId).subscribe(
      freeDays => {
        this.freeDays = freeDays;
        console.log(freeDays);
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }
}
