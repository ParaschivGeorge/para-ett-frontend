import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { LeaveRequest } from 'src/app/models/leave-request';
import { LeaveRequestsService } from 'src/app/services/leave-requests.service';
import { ActivatedRoute } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  id: number;
  leaveRequest: LeaveRequest;
  leaveRequestTypes = ['ANNUAL_LEAVE_OR_ABSENCE', 'BEREAVEMENT_LEAVE', 'BLOOD_DONATION', 'BUSINESS_TRIP', 'CHILD_BIRTH', 'CHILD_MARRIAGE_LEAVE',
        'CHILDCARE_LEAVE', 'MARRIAGE_LEAVE', 'MATERNITY_LEAVE', 'OTHER_UNPAID_LEAVE', 'OVERTIME_COMPENSATION', 'PATERNITY_LEAVE',
        'PRE_NATAL_EXAMINATION_LEAVE', 'PUBLIC_STATUTORY_DUTIES', 'PUBLIC_HOLIDAYS_OTHER_RELIGION', 'RELOCATION_LEAVE', 'SICKNESS',
        'TRAINING', 'UNPAID_INFANT_CARE_LEAVE', 'VOLUNTEER_LEAVE', 'WORK_FROM_HOME'];
  leaveRequestStatuses = ['APPROVED', 'DENIED', 'PENDING'];
  leaveRequestEditForm: FormGroup = new FormGroup({
    date: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required),
    approved: new FormControl(null, Validators.required)
  });

  constructor(private leaveRequestsService: LeaveRequestsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getLeaveRequest(this.id);
  }

  getLeaveRequest(id: number) {
    this.leaveRequestsService.getLeaveRequest(id).subscribe(
     leaveRequest => {
        this.leaveRequest = JSON.parse(JSON.stringify(leaveRequest));
        delete leaveRequest.id;
        delete leaveRequest.companyId;
        delete leaveRequest.managerId;
        delete leaveRequest.userId;
        leaveRequest.date = new Date(leaveRequest.date);
        this.leaveRequestEditForm.setValue(leaveRequest);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log(this.leaveRequestEditForm.valid);
    if (this.leaveRequestEditForm.valid) {
      const leaveRequest = this.leaveRequestEditForm.value as LeaveRequest;
      leaveRequest.id = this.id;
      // TODO: set user data
      leaveRequest.companyId = 1;
      leaveRequest.managerId = 1;
      leaveRequest.userId = 1;
      this.leaveRequestsService.updateLeaveRequest(this.id, leaveRequest).subscribe(
        editedLeaveRequest => {
          console.log(editedLeaveRequest);
          this.getLeaveRequest(this.id);
        },
        error => {
          console.log(error);
        }
      );
    }
  }


}
