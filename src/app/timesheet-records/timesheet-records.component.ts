import { Component, OnInit } from '@angular/core';
import { TimesheetRecordsService } from '../services/timesheet-records.service';
import { TimesheetRecord } from '../models/timesheet-record';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormArray, Validators } from '@angular/forms';

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

  matcher = new MyErrorStateMatcher();
  timesheetRecords: TimesheetRecord[] = [];
  timesheetRecordsCreateForm: FormGroup = new FormGroup({
    timesheetRecords: new FormArray([])
  });
  overtimeStatus = [false, true];

  constructor(private timesheetRecordsService: TimesheetRecordsService) { }

  ngOnInit() {
    this.getTimesheetRecords();
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
}
