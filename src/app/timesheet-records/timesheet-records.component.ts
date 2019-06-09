import { Component, OnInit } from '@angular/core';
import { TimesheetRecordsService } from '../services/timesheet-records.service';
import { TimesheetRecord } from '../models/timesheet-record';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormArray, Validators } from '@angular/forms';
import { DataHolderService } from '../services/data-holder.service';
import { UsersService } from '../services/users.service';
import { Project } from '../models/project';
import { ProjectsService } from '../services/projects.service';

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
  timesheetRecordsCreateForm: FormGroup = new FormGroup({
    timesheetRecords: new FormArray([])
  });
  overtimeStatus = [false, true];
  monthFormControl: FormControl = new FormControl(this.month);
  calendarForm: FormGroup;

  projects: Project[] = [];

  constructor(
    private timesheetRecordsService: TimesheetRecordsService,
    private projectsService: ProjectsService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    // this.getTimesheetRecords();
    console.log(this.month, this.year);
    this.monthFormControl.valueChanges.subscribe(value => {
      this.month = this.monthFormControl.value;
      this.updateCalendar();
    });
    this.getProjects();
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
    this.year = (this.month === 11) ? this.month + 1 : this.month;
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
    this.calendar.forEach(week => {
      week.forEach(day => {
        if (day !== -1) {
          const dayForm = new FormGroup({});
          this.projects.forEach(project => {
            dayForm.addControl(project.id.toString(), new FormControl(0));
          });
          calendarFormArray.push(dayForm);
        }
      });
    });
    // console.log(this.calendarForm.value);
  }

  getTimesheetRecords() {
    // TODO: set filters
    this.timesheetRecordsService.getTimesheetRecords(null, null, null, null, null).subscribe(
      timesheetRecords => {
        this.timesheetRecords = timesheetRecords;
        console.log(timesheetRecords);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteTimesheetRecord(id: number) {
    this.timesheetRecordsService.deleteTimesheetRecord(id).subscribe(
      data => {
        console.log(data);
        this.getTimesheetRecords();
      },
      error => {
        console.log(error);
      }
    );
  }

  get timesheetRecordsFormArray(): FormArray {
    return this.timesheetRecordsCreateForm.get('timesheetRecords') as FormArray;
  }

  addTimesheetRecord() {
    if (this.timesheetRecordsCreateForm.valid) {
      this.timesheetRecordsFormArray.push(
        new FormGroup({
          date: new FormControl(null, Validators.required),
          noHours: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
          overtime: new FormControl(null, Validators.required),
          projectId: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')])
        })
      );
    }
  }

  removeTimesheetRecord(index: number) {
    this.timesheetRecordsFormArray.removeAt(index);
  }

  onSubmit() {
    console.log(this.timesheetRecordsCreateForm.valid);
    if (this.timesheetRecordsCreateForm.valid) {
      const timesheetRecords = this.timesheetRecordsFormArray.value as TimesheetRecord[];
      timesheetRecords.map(timesheetRecord => {
          // TODO replace with user data
        timesheetRecord.companyId = 1;
        timesheetRecord.managerId = 1;
        timesheetRecord.userId = 1;
      });
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

  getProjects() {
    if (this.dataHolderService.user) {
      this.dataHolderService.loading = true;
      this.projectsService.getProjects(this.dataHolderService.user.companyId, null, null).subscribe(
        projects => {
          this.projects = projects;
          console.log(projects);
          this.updateCalendar();
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    } else {
      // this.router.navigate(['start']);
    }
  }

  onChange(event, day: number, project: Project) {
    const calendarFormArray = this.calendarForm.get('calendar') as FormArray;
    calendarFormArray.controls[day - 1].get(project.id.toString()).setValue(event.srcElement.value);
    // console.log(this.calendarForm.value);
  }
}
