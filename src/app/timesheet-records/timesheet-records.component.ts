import { Component, OnInit } from '@angular/core';
import { TimesheetRecordsService } from '../services/timesheet-records.service';
import { TimesheetRecord } from '../models/timesheet-record';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormArray, Validators } from '@angular/forms';
import { DataHolderService } from '../services/data-holder.service';
import { UsersService } from '../services/users.service';
import { Project } from '../models/project';
import { ProjectsService } from '../services/projects.service';
import { FreeDaysService } from '../services/free-days.service';
import { FreeDay } from '../models/free-day';
import { LeaveRequestsService } from '../services/leave-requests.service';
import { LeaveRequest } from '../models/leave-request';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-timesheet-records',
  templateUrl: './timesheet-records.component.html',
  styleUrls: ['./timesheet-records.component.css']
})
export class TimesheetRecordsComponent implements OnInit {

  today = new Date();
  year: number = this.today.getFullYear();
  month: number = this.today.getMonth();
  calendar = [];
  monthsNumbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  matcher = new MyErrorStateMatcher();
  timesheetRecords: TimesheetRecord[] = [];
  overtimeStatus = [false, true];
  monthFormControl: FormControl = new FormControl(this.month);
  calendarForm: FormGroup;

  projects: Project[] = [];
  freeDays: FreeDay[] = [];
  leaveRequests: LeaveRequest[] = [];

  constructor(
    private timesheetRecordsService: TimesheetRecordsService,
    private projectsService: ProjectsService,
    private freeDaysService: FreeDaysService,
    private leaveRequestsService: LeaveRequestsService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    console.log(this.month, this.year);
    this.monthFormControl.valueChanges.subscribe(value => {
      this.month = this.monthFormControl.value;
      console.log(this.month);
      this.updateCalendar();
    });
    this.getProjects();
    this.getFreeDays();
    this.getLeaveRequests();
  }

  getLeaveRequests() {
    this.leaveRequestsService.getLeaveRequests(this.dataHolderService.user.companyId, null, this.dataHolderService.user.id, 'APPROVED', null, null).subscribe(
      leaveRequests => {
        this.leaveRequests = leaveRequests;
        console.log(leaveRequests);
        this.updateFormWithLeaveRequests();
      },
      error => {
        console.log(error);
      }
    );
  }

  getFreeDays() {
    this.freeDaysService.getFreeDays(this.dataHolderService.user.companyId).subscribe(
      freeDays => {
        this.freeDays = freeDays;
        console.log(freeDays);
        this.updateFormWithFreeDays();
      },
      error => {
        console.log(error);
      }
    );
  }

  updateFormWithFreeDays() {
    if (this.projects.length) {
      let needsUpdate = false;
      this.freeDays.forEach(freeDay => {
        console.log(freeDay);
        const date = new Date(freeDay.date);
        if (date.getMonth() === this.month && date.getFullYear() === this.year) {
          console.log('here');
          const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
          const control = calendarFormArray.controls[date.getDate() - 1] as FormControl;
          this.projects.forEach(project => {
            if (control.get(project.id.toString()).value != 0) {
              needsUpdate = true;
              control.get(project.id.toString()).setValue(0);
            }
          });
          control.disable();
        }
      });
      if (needsUpdate) {
        this.submit();
      }
    }
  }

  updateFormWithLeaveRequests() {
    if (this.projects.length) {
      let needsUpdate = false;
      this.leaveRequests.forEach(leaveRequest => {
        // console.log(leaveRequest);
        const date = new Date(leaveRequest.date);
        if (date.getMonth() === this.month && date.getFullYear() === this.year) {
          const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
          const control = calendarFormArray.controls[date.getDate() - 1] as FormControl;
          this.projects.forEach(project => {
            if (control.get(project.id.toString()).value != 0) {
              needsUpdate = true;
              control.get(project.id.toString()).setValue(0);
            }
          });
          control.disable();
        }
      });
      if (needsUpdate) {
        this.submit();
      }
    }
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
    this.updateCalendarForm();
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

  updateCalendarForm() {
    this.calendarForm = new FormGroup({
      calendar: new FormArray([])
    });
    const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
    calendarFormArray.setValue([]);
    this.calendar.forEach(week => {
      week.forEach(day => {
        if (day !== -1) {
          const dayForm = new FormGroup({});
          this.projects.forEach(project => {
            dayForm.addControl(project.id.toString(), new FormControl(0, Validators.pattern('[0-9]*')));
          });
          calendarFormArray.push(dayForm);
        }
      });
    });
    this.getTimesheetRecords();
    // console.log(this.calendarForm.value);
  }

  getTimesheetRecords() {
    this.timesheetRecordsService.getTimesheetRecords(
      this.dataHolderService.user.companyId,
      null,
      this.dataHolderService.user.id,
      new Date(this.year, this.month, 0),
      new Date(this.year, this.month + 1, 1)).subscribe(
      timesheetRecords => {
        this.timesheetRecords = timesheetRecords;
        console.log(timesheetRecords);
        timesheetRecords.forEach(timesheetRecord => {
          const date = new Date(timesheetRecord.date);
          const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
          calendarFormArray.controls[date.getDate() - 1].get(timesheetRecord.projectId.toString()).setValue(timesheetRecord.noHours);
          // if (timesheetRecord.noHours !== 0) {
          //   console.log(timesheetRecord);
          //   console.log(calendarFormArray.controls[date.getDate() - 1].get(timesheetRecord.projectId.toString()).value);
          // }
        });
        // console.log(this.calendarForm.get('calendar').value);
        if (this.freeDays.length) {
          this.updateFormWithFreeDays();
        }
        if (this.leaveRequests.length) {
          this.updateFormWithLeaveRequests();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getProjects() {
    this.dataHolderService.loading = true;
    this.projectsService.getProjects(this.dataHolderService.user.companyId, null, this.dataHolderService.user.id).subscribe(
      projects => {
        this.projectsService.getProjects(this.dataHolderService.user.companyId, this.dataHolderService.user.id, null).subscribe(
          projectsR => {
            this.projects = projects.concat(projectsR);
            console.log(this.projects);
            this.updateCalendar();
          },
          error => {{
            console.log(error);
          }}
        );
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.dataHolderService.loading = false;
    });
  }

  getFormControl(day: number, project: Project): FormControl {
    if (day === -1) {
      return new FormControl({value: null, disabled: true});
    }
    const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
    const control = calendarFormArray.controls[day - 1].get(project.id.toString()) as FormControl;
    // if (control.value !== 0) {
    //   console.log(control);
    // }
    return control;
  }

  submit() {
    if (this.calendarForm.valid) {
      const timesheetRecords: TimesheetRecord[] = [];
      const daysInMonth = this.daysInMonth(this.month, this.year);
      const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
      for (let day = 1; day <= daysInMonth; day++) {
        this.projects.forEach(project => {
          const formControl = calendarFormArray.controls[day - 1].get(project.id.toString()) as FormControl;
          const records = this.timesheetRecords.filter(tsr => tsr.projectId === project.id && new Date(tsr.date).getDate() === day);
          const timesheetRecord: TimesheetRecord = {
            companyId: this.dataHolderService.user.companyId,
            date: new Date(this.year, this.month, day).toLocaleDateString('en-US'),
            id: null,
            managerId: this.dataHolderService.user.managerId,
            noHours: null,
            overtime: false,
            projectId: project.id,
            userId: this.dataHolderService.user.id
          };
          if (records.length > 0) {
            timesheetRecord.id = records[0].id;
            // if (records.length > 1) {
            //   console.log('records: ', records);
            // }
          }
          timesheetRecord.noHours = formControl.value;
          // if (timesheetRecord.noHours !== 0) {
          //   console.log(timesheetRecord);
          // }
          timesheetRecords.push(timesheetRecord);
        });
      }
      console.log(timesheetRecords);
      this.timesheetRecordsService.createTimesheetRecords(timesheetRecords).subscribe(
        createdTimesheetRecords => {
          console.log(createdTimesheetRecords);
          this.getTimesheetRecords();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
