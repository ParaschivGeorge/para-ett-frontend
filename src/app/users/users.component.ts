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
  displayedColumnsDesktop: string[] = ['email', 'firstName', 'lastName', 'type', 'freeDaysLeft', 'norm', 'manager', 'clocking'];
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
  calendar = [];
  workingDays = 0;

  private _filter = '';

  get filter(): string {
    return this._filter;
  }

  set filter(value: string) {
    this._filter = value;
    this.applyFilter();
  }

  private _clockedAllFilter = false;

  get clockedAllFilter(): boolean {
    return this._clockedAllFilter;
  }

  set clockedAllFilter(value: boolean) {
    if (value === true) {
      this.clockedPartiallyFilter = false;
    }
    this._clockedAllFilter = value;
    this.applyFilter();
  }

  private _clockedPartiallyFilter = false;

  get clockedPartiallyFilter(): boolean {
    return this._clockedPartiallyFilter;
  }

  set clockedPartiallyFilter(value: boolean) {
    if (value === true) {
      this.clockedAllFilter = false;
    }
    this._clockedPartiallyFilter = value;
    this.applyFilter();
  }

  private _myTeamFilter = false;

  get myTeamFilter(): boolean {
    return this._myTeamFilter;
  }

  set myTeamFilter(value: boolean) {
    if (value === true) {
      this.myManagerTeamFilter = false;
    }
    this._myTeamFilter = value;
    this.applyFilter();
  }

  private _myManagerTeamFilter = false;

  get myManagerTeamFilter(): boolean {
    return this._myManagerTeamFilter;
  }

  set myManagerTeamFilter(value: boolean) {
    if (value === true) {
      this.myTeamFilter = false;
    }
    this._myManagerTeamFilter = value;
    this.applyFilter();
  }

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
        this.updateCalendar();
        this.calculateWorkingDays();
        console.log(this.month);
      });
      this.updateCalendar();
      this.calculateWorkingDays();
      this.getTimesheetRecords();
      this.getLeaveRequests();
      this.getFreeDays();
    }
  }

  applyFilter() {
    const filterData: FilterData = {
      filter: this.filter.trim().toLowerCase(),
      clockedAllFilter: this.clockedAllFilter,
      clockedPartiallyFilter: this.clockedPartiallyFilter,
      myTeamFilter: this.myTeamFilter,
      myManagerTeamFilter: this.myManagerTeamFilter
    };
    console.log(this.filter);
    console.log(filterData)
    this.dataSource.filter = JSON.stringify(filterData);
  }

  getUsers() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
      users => {
        this.users = users;
        this.dataSource = new MatTableDataSource(users);

        this.dataSource.filterPredicate = (data: User, filter: string) => {
          let result = true;
          const filterData = JSON.parse(filter) as FilterData;
          if (filterData.filter) {
            result = (data.email + data.firstName + data.lastName).toLowerCase().includes(filterData.filter);
            if (!result) {
              return false;
            }
          }
          if (filterData.clockedAllFilter) {
            result = this.calculateTotalHours(data) <= this.calculateFreeDaysHours(data) + this.calculateLeaveRequestsHours(data) + this.calculateWorkedHours(data);
            if (!result) {
              return false;
            }
          }
          if (filterData.clockedPartiallyFilter) {
            result = this.calculateTotalHours(data) > this.calculateFreeDaysHours(data) + this.calculateLeaveRequestsHours(data) + this.calculateWorkedHours(data);
            if (!result) {
              return false;
            }
          }
          if (filterData.myTeamFilter) {
            result = this.dataHolderService.user.id === data.managerId;
            if (!result) {
              return false;
            }
          }
          if (filterData.myManagerTeamFilter) {
            result = this.dataHolderService.user.managerId === data.managerId;
            if (!result) {
              return false;
            }
          }
          return true;
        };

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

  isOwnerOrManager(): boolean {
    return this.dataHolderService.user && (this.dataHolderService.user.type === 'MANAGER' || this.dataHolderService.user.type === 'OWNER');
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

  next() {
    this.year = (this.month === 11) ? this.year + 1 : this.year;
    this.month = (this.month + 1) % 12;
    this.monthFormControl.setValue(this.month);
  }

  previous() {
    this.year = (this.month === 0) ? this.year - 1 : this.year;
    this.month = (this.month === 0) ? 11 : this.month - 1;
    this.monthFormControl.setValue(this.month);
  }

  daysInMonth(month: number, year: number): number {
    return 32 - new Date(month, year, 32).getDate();
  }

  getSum(total: number, num: number) {
    return total + num;
  }

  calculateTotalHours(user: User) {
    return user.norm * this.workingDays;
  }

  calculateWorkingDays() {
    let num = 0;
    this.calendar.forEach(week => {
      num += week[5] === -1 ? 0 : 1;
      num += week[6] === -1 ? 0 : 1;
    });
    this.workingDays = this.daysInMonth(this.month, this.year) - num;
  }

  calculateWorkedHours(user: User) {
    return this.timesheetRecords.filter(tsr => {
      const date = new Date(tsr.date);
      return (tsr.userId === user.id && date.getMonth() === this.month);
    }).map(tsr => tsr.noHours).reduce(this.getSum, 0);
  }

  calculateFreeDaysHours(user: User) {
    return this.freeDays.filter(fd => {
      const date = new Date(fd.date);
      return date.getMonth() === this.month;
    }).length * user.norm;
  }

  calculateLeaveRequestsHours(user: User) {
    return this.leaveRequests.filter(lr => {
      const date = new Date(lr.date);
      return (lr.userId === user.id && date.getMonth() === this.month);
    }).length * user.norm;
  }

  updateCalendar() {
    const firstDay = (new Date(this.year, this.month)).getDay();
    let date = 1;
    const daysInMonth = this.daysInMonth(this.month, this.year);
    const month = [];
    let diff = 0;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || (date > daysInMonth && date <= (daysInMonth - (daysInMonth % 7) + 7 - diff))) {
          if (j > firstDay) {
            date++;
          } else {
            diff++;
          }
          week.push(-1);
        } else if (date + diff > (daysInMonth - (daysInMonth % 7) + 7) && date > daysInMonth) {
          if (week.length < 7 && week.length > 0) {
            week.push(-1);
          } else {
            break;
          }
        } else {
          week.push(date);
          date++;
        }
      }
      if (week.length) {
        month.push(week);
      }
    }
    this.calendar = month;
    console.log(this.calendar);
    this.getTimesheetRecords();
  }

  getManagerEmail(user: User): string {
    const manager = this.users.find(usr => user.managerId === usr.id);
    if (manager) { return manager.email; }
    return '';
  }

  hasManager() {
    return this.dataHolderService.user && this.dataHolderService.user.managerId;
  }
}

export interface FilterData {
  filter: string;
  clockedAllFilter: boolean;
  clockedPartiallyFilter: boolean;
  myTeamFilter: boolean;
  myManagerTeamFilter: boolean;
}
