import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { LeaveRequest } from 'src/app/models/leave-request';
import { LeaveRequestsService } from 'src/app/services/leave-requests.service';
import { ActivatedRoute } from '@angular/router';
import { DataHolderService } from 'src/app/services/data-holder.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';

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
  @Input() leaveRequest: LeaveRequest;
  leaveRequestTypes = ['ANNUAL_LEAVE_OR_ABSENCE', 'BEREAVEMENT_LEAVE', 'BLOOD_DONATION', 'BUSINESS_TRIP', 'CHILD_BIRTH', 'CHILD_MARRIAGE_LEAVE',
        'CHILDCARE_LEAVE', 'MARRIAGE_LEAVE', 'MATERNITY_LEAVE', 'OTHER_UNPAID_LEAVE', 'OVERTIME_COMPENSATION', 'PATERNITY_LEAVE',
        'PRE_NATAL_EXAMINATION_LEAVE', 'PUBLIC_STATUTORY_DUTIES', 'PUBLIC_HOLIDAYS_OTHER_RELIGION', 'RELOCATION_LEAVE', 'SICKNESS',
        'TRAINING', 'UNPAID_INFANT_CARE_LEAVE', 'VOLUNTEER_LEAVE', 'WORK_FROM_HOME'];
  leaveRequestStatuses = ['APPROVED', 'DENIED', 'PENDING'];
  leaveRequestEditForm: FormGroup = new FormGroup({
    id: new FormControl({value: null, disabled: true}),
    companyId: new FormControl({value: null, disabled: true}),
    managerId: new FormControl({value: null, disabled: true}),
    userId: new FormControl({value: null, disabled: true}),
    date: new FormControl({value: null, disabled: !this.userLeaveRequest()}, Validators.required),
    type: new FormControl({value: null, disabled: !this.userLeaveRequest()}, Validators.required),
    status: new FormControl({value: null, disabled: !this.teamLeaveRequest()}, Validators.required)
  });
  user: User = null;

  constructor(
    private leaveRequestsService: LeaveRequestsService,
    private route: ActivatedRoute,
    private dataHolderService: DataHolderService,
    private usersService: UsersService) { }

  ngOnInit() {
    if (this.leaveRequest) {
      const leaveRequest = JSON.parse(JSON.stringify(this.leaveRequest));
      this.id = this.leaveRequest.id;
      leaveRequest.date = new Date(leaveRequest.date);
      console.log(leaveRequest);
      this.leaveRequestEditForm.setValue(leaveRequest);
      if (this.userLeaveRequest()) {
        this.leaveRequestEditForm.get('date').disable();
        this.leaveRequestEditForm.get('type').disable();
        if (!this.isMainOwner()) {
          this.leaveRequestEditForm.get('status').disable();
        } else {
          this.leaveRequestEditForm.get('status').enable();
        }
      } else if (this.teamLeaveRequest()) {
        this.leaveRequestEditForm.get('date').disable();
        this.leaveRequestEditForm.get('type').disable();
        this.leaveRequestEditForm.get('status').enable();
        this.getUser();
      }
    }
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
        if (this.userLeaveRequest()) {
          this.leaveRequestEditForm.get('date').disable();
          this.leaveRequestEditForm.get('type').disable();
          this.leaveRequestEditForm.get('status').disable();
        } else if (this.teamLeaveRequest()) {
          this.leaveRequestEditForm.get('date').disable();
          this.leaveRequestEditForm.get('type').disable();
          this.leaveRequestEditForm.get('status').enable();
        }
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

  getUser() {
    this.usersService.getUser(this.leaveRequest.userId).subscribe(
      user => {
        this.user = user;
      },
      error => {
        console.log(error);
      }
    );
  }

  userLeaveRequest(): boolean {
    return this.dataHolderService.user && this.leaveRequest && (this.dataHolderService.user.id === this.leaveRequest.userId);
  }

  teamLeaveRequest(): boolean {
    return this.dataHolderService.user && this.leaveRequest && (this.dataHolderService.user.id === this.leaveRequest.managerId);
  }

  isMainOwner() {
    return this.dataHolderService.user && this.dataHolderService.user.managerId === null && this.dataHolderService.user.type === 'OWNER';
  }
}
