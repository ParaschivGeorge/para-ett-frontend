import { Component, OnInit } from '@angular/core';
import { LeaveRequestsService } from '../services/leave-requests.service';
import { LeaveRequest } from '../models/leave-request';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { DataHolderService } from '../services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css']
})
export class LeaveRequestsComponent implements OnInit {

  leaveRequestCreateForm: FormGroup = new FormGroup({
    date: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required)
  });
  leaveRequests: LeaveRequest[] = [];
  teamLeaveRequests: LeaveRequest[] = [];
  leaveRequestTypes = ['ANNUAL_LEAVE_OR_ABSENCE', 'BEREAVEMENT_LEAVE', 'BLOOD_DONATION', 'BUSINESS_TRIP', 'CHILD_BIRTH', 'CHILD_MARRIAGE_LEAVE',
        'CHILDCARE_LEAVE', 'MARRIAGE_LEAVE', 'MATERNITY_LEAVE', 'OTHER_UNPAID_LEAVE', 'OVERTIME_COMPENSATION', 'PATERNITY_LEAVE',
        'PRE_NATAL_EXAMINATION_LEAVE', 'PUBLIC_STATUTORY_DUTIES', 'PUBLIC_HOLIDAYS_OTHER_RELIGION', 'RELOCATION_LEAVE', 'SICKNESS',
        'TRAINING', 'UNPAID_INFANT_CARE_LEAVE', 'VOLUNTEER_LEAVE', 'WORK_FROM_HOME'];

  constructor(
    private leaveRequestsService: LeaveRequestsService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.getLeaveRequests();
    if (this.isManager()) {
      this.getTeamLeaveRequests();
    }
  }

  get user() {
    return this.dataHolderService.user;
  }

  isManager() {
    return this.user && (this.user.type === 'MANAGER' || this.user.type === 'OWNER');
  }

  getLeaveRequests() {
    this.leaveRequestsService.getLeaveRequests(this.user.companyId, null, this.user.id, null, null, null).subscribe(
      leaveRequests => {
        this.leaveRequests = leaveRequests;
        console.log(leaveRequests);
      },
      error => {
        console.log(error);
      }
    );
  }

  getTeamLeaveRequests() {
    this.leaveRequestsService.getLeaveRequests(this.user.companyId, this.user.id, null, null, null, null).subscribe(
      leaveRequests => {
        this.teamLeaveRequests = leaveRequests;
        console.log(leaveRequests);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteLeaveRequest(id: number) {
    this.leaveRequestsService.deleteLeaveRequest(id).subscribe(
      data => {
        console.log(data);
        this.getLeaveRequests();
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log(this.leaveRequestCreateForm.valid);
    if (this.leaveRequestCreateForm.valid) {
      const leaveRequest = this.leaveRequestCreateForm.value as LeaveRequest;
      leaveRequest.companyId = this.user.companyId;
      leaveRequest.managerId = this.user.managerId;
      leaveRequest.userId = this.user.id;
      leaveRequest.status = 'PENDING';
      this.leaveRequestsService.createLeaveRequest(leaveRequest).subscribe(
        createdLeaveRequest => {
          console.log(createdLeaveRequest);
          this.getLeaveRequests();
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
