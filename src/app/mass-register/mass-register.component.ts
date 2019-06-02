import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormGroup, FormArray, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MassRegisterUserDto } from '../models/mass-register-user-dto';
import { ErrorStateMatcher } from '@angular/material';
import { DataHolderService } from '../services/data-holder.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-mass-register',
  templateUrl: './mass-register.component.html',
  styleUrls: ['./mass-register.component.css']
})
export class MassRegisterComponent implements OnInit {

  success: string = null;
  error: string = null;
  matcher = new MyErrorStateMatcher();
  massRegisterForm: FormGroup = new FormGroup({
    massRegister: new FormArray([])
  });
  userTypes = ['EMPLOYEE', 'MANAGER', 'HR'];
  users: User[] = [];

  constructor(
    private usersService: UsersService,
    private dataHolderService: DataHolderService,
    private router: Router) { }

  ngOnInit() {
    this.addUserForm();
    if (this.dataHolderService.user) {
      this.dataHolderService.loading = true;
      this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
        users => {
          this.users = users;
          console.log(users);
        },
        error => {
          console.log(error);
        }
      ).add(() => {
        setTimeout(() => this.dataHolderService.loading = false, 500);
      });
    } else {
      this.router.navigate(['start']);
    }

    this.massRegisterForm.valueChanges.subscribe(
      value => {
        this.error = null;
      }
    );
  }

  addUserForm() {
    if (this.massRegisterForm.valid) {
      const userFormGroup: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        freeDaysTotal: new FormControl(21, [Validators.required, Validators.pattern('[0-9]*')]),
        lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        managerEmail: new FormControl('', [Validators.required, Validators.email]),
        norm: new FormControl(8, [Validators.required, Validators.pattern('[0-9]*')]),
        type: new FormControl('EMPLOYEE', [Validators.required])
      });
      const massRegister = this.massRegisterForm.get('massRegister') as FormArray;
      massRegister.push(userFormGroup);
    }
  }

  removeUsersForm(i: number) {
    const massRegister = this.massRegisterForm.get('massRegister') as FormArray;
    if (massRegister.length > 1) {
      massRegister.removeAt(i);
    }
  }

  onSubmit() {
    console.log(this.massRegisterForm.valid);
    if (this.massRegisterForm.valid) {
      const massRegisterUserDtos = this.massRegisterForm.get('massRegister').value as MassRegisterUserDto[];
      console.log(massRegisterUserDtos);
      this.dataHolderService.loading = true;
      this.usersService.massRegister(this.dataHolderService.user.companyId, massRegisterUserDtos).subscribe(
        data => {
          console.log(data);
          this.massRegisterForm = new FormGroup({
            massRegister: new FormArray([])
          });
          this.addUserForm();
          this.success = 'Request successful! Your employees must activate their accounts now.';
        },
        error => {
          console.log(error);
          this.error = 'There was a problem processing your request! Please recheck the form or retry later.';
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    }
  }

  get massRegister(): FormArray {
    return this.massRegisterForm.get('massRegister') as FormArray;
  }

  getManagerEmails(): string[] {
    const managerEmails = [];
    const massRegisterUserDtos = this.massRegisterForm.get('massRegister').value as MassRegisterUserDto[];
    massRegisterUserDtos.forEach(element => {
      if (element.type === 'MANAGER') {
        if (element.email) {
          managerEmails.push(element.email);
        }
      }
    });
    this.users.forEach(user => {
      if (user.type === 'MANAGER' || user.type === 'OWNER') {
        if (user.email) {
          managerEmails.push(user.email);
        }
      }
    });
    return managerEmails;
  }

  getManagerAuto(i: number) {
    const value = this.massRegister.controls[i].get('managerEmail').value;
    return this.getManagerEmails().filter(email => email.toLocaleLowerCase().indexOf(value) === 0 && email !== value);
  }
}
