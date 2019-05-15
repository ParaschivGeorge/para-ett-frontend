import { Component, OnInit } from '@angular/core';
import { TimesheetRecord } from 'src/app/models/timesheet-record';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { TimesheetRecordsService } from 'src/app/services/timesheet-records.service';
import { ActivatedRoute } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-timesheet-record',
  templateUrl: './timesheet-record.component.html',
  styleUrls: ['./timesheet-record.component.css']
})
export class TimesheetRecordComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  id: number;
  timesheetRecord: TimesheetRecord;
  timesheetRecordEditForm: FormGroup = new FormGroup({
    date: new FormControl(null, Validators.required),
    noHours: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
    overtime: new FormControl(null, Validators.required),
    projectId: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')])
  });
  overtimeStatus = [false, true];

  constructor(private timesheetRecordsService: TimesheetRecordsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getTimesheetRecord(this.id);
  }

  getTimesheetRecord(id: number) {
    this.timesheetRecordsService.getTimesheetRecord(id).subscribe(
      timesheetRecord => {
        this.timesheetRecord = JSON.parse(JSON.stringify(timesheetRecord));
        console.log(this.timesheetRecord);
        delete timesheetRecord.id;
        delete timesheetRecord.companyId;
        delete timesheetRecord.managerId;
        delete timesheetRecord.userId;
        timesheetRecord.date = new Date(timesheetRecord.date);
        this.timesheetRecordEditForm.setValue(timesheetRecord);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log(this.timesheetRecordEditForm.valid);
    if (this.timesheetRecordEditForm.valid) {
      const timesheetRecord = this.timesheetRecordEditForm.value as TimesheetRecord;
      timesheetRecord.id = this.id;
      // TODO: replace with user data
      timesheetRecord.companyId = 1;
      timesheetRecord.managerId = 1;
      timesheetRecord.userId = 1;
      this.timesheetRecordsService.updateTimesheetRecord(this.id, timesheetRecord).subscribe(
        editedTimesheetRecord => {
          console.log(editedTimesheetRecord);
          this.getTimesheetRecord(this.id);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
