import { Component, OnInit } from '@angular/core';
import { LeaveRequestsService } from '../services/leave-requests.service';
import { LeaveRequest } from '../models/leave-request';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { DataHolderService } from '../services/data-holder.service';
import { User } from '../models/user';
import { UsersService } from '../services/users.service';

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
  futureLeaveRequests: LeaveRequest[] = [];
  pastLeaveRequests: LeaveRequest[] = [];
  teamLeaveRequests: LeaveRequest[] = [];
  leaveRequestTypes = ['ANNUAL_LEAVE_OR_ABSENCE', 'BEREAVEMENT_LEAVE', 'BLOOD_DONATION', 'BUSINESS_TRIP', 'CHILD_BIRTH', 'CHILD_MARRIAGE_LEAVE',
        'CHILDCARE_LEAVE', 'MARRIAGE_LEAVE', 'MATERNITY_LEAVE', 'OTHER_UNPAID_LEAVE', 'OVERTIME_COMPENSATION', 'PATERNITY_LEAVE',
        'PRE_NATAL_EXAMINATION_LEAVE', 'PUBLIC_STATUTORY_DUTIES', 'PUBLIC_HOLIDAYS_OTHER_RELIGION', 'RELOCATION_LEAVE', 'SICKNESS',
        'TRAINING', 'UNPAID_INFANT_CARE_LEAVE', 'VOLUNTEER_LEAVE'];

  constructor(
    private leaveRequestsService: LeaveRequestsService,
    private usersService: UsersService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.getLeaveRequests();
    if (this.isManager()) {
      this.getTeamLeaveRequests();
    }
    this.dataHolderService.leavrRequestsSubject.subscribe(leaveRequest => {
      let oldLr = this.futureLeaveRequests.find(lr => lr.id === leaveRequest.id);
      if (oldLr) {
        this.futureLeaveRequests = this.futureLeaveRequests.filter(lr => lr.id !== leaveRequest.id);
        this.futureLeaveRequests.push(leaveRequest);
      }
      oldLr = this.pastLeaveRequests.find(lr => lr.id === leaveRequest.id);
      if (oldLr) {
        this.pastLeaveRequests = this.pastLeaveRequests.filter(lr => lr.id !== leaveRequest.id);
        this.pastLeaveRequests.push(leaveRequest);
      }
      oldLr = this.teamLeaveRequests.find(lr => lr.id === leaveRequest.id);
      if (oldLr) {
        this.teamLeaveRequests = this.teamLeaveRequests.filter(lr => lr.id !== leaveRequest.id);
        this.teamLeaveRequests.push(leaveRequest);
      }
    });
  }

  get user() {
    return this.dataHolderService.user;
  }

  isManager() {
    return this.user && (this.user.type === 'MANAGER' || this.user.type === 'OWNER');
  }

  isMainOwner() {
    return this.user && this.user.managerId === null && this.user.type === 'OWNER';
  }

  getLeaveRequests() {
    this.leaveRequestsService.getLeaveRequests(this.user.companyId, null, this.user.id, null, null, null).subscribe(
      leaveRequests => {
        const today = new Date();
        this.futureLeaveRequests = leaveRequests.filter(lr => new Date(lr.date) > today);
        this.pastLeaveRequests = leaveRequests.filter(lr => new Date(lr.date) <= today);
        console.log(leaveRequests);
      },
      error => {
        console.log(error);
      }
    );
  }

  getTeamLeaveRequests() {
    this.leaveRequestsService.getLeaveRequests(this.user.companyId, this.user.id, null, 'PENDING', null, null).subscribe(
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
    console.log(this.futureLeaveRequests.filter(lr => lr.id === id))
    const leaveRequest = JSON.parse(JSON.stringify(this.futureLeaveRequests.filter(lr => lr.id === id)[0]));
    console.log(leaveRequest)
    this.leaveRequestsService.deleteLeaveRequest(id).subscribe(
      data => {
        console.log(data);
        console.log(leaveRequest)
        if (leaveRequest.status === 'APPROVED') {
          this.dataHolderService.user.freeDaysLeft++;
          this.usersService.updateUser(this.dhUser.id, this.dhUser).subscribe(
            user => {
              console.log(user);
              this.dataHolderService.user = user;
            },
            error => {
              console.log(error);
            }
          );
        }
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

  get dhUser(): User {
    return this.dataHolderService.user;
  }
}
