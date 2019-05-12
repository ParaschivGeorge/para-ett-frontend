import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormGroup, FormArray, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MassRegisterUserDto } from '../models/mass-register-user-dto';
import { ErrorStateMatcher } from '@angular/material';

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

  matcher = new MyErrorStateMatcher();
  massRegisterForm: FormGroup = new FormGroup({
    massRegister: new FormArray([])
  });
  userTypes = ['EMPLOYEE', 'MANAGER', 'HR'];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.addUserForm();
  }

  addUserForm() {
    if (this.massRegisterForm.valid) {
      const userFormGroup: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        freeDaysTotal: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
        lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        managerEmail: new FormControl(null, [Validators.required, Validators.email]),
        norm: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
        type: new FormControl(null, [Validators.required])
      });
      const massRegister = this.massRegisterForm.get('massRegister') as FormArray;
      massRegister.push(userFormGroup);
    }
  }

  removeUsersForm() {
    const massRegister = this.massRegisterForm.get('massRegister') as FormArray;
    if (massRegister.length > 1) {
      massRegister.removeAt(massRegister.length - 1);
    }
  }

  onSubmit() {
    console.log(this.massRegisterForm.valid);
    if (this.massRegisterForm.valid) {
      const massRegisterUserDtos = this.massRegisterForm.get('massRegister').value as MassRegisterUserDto[];
      console.log(massRegisterUserDtos);
      // TODO: replace with user company id
      this.usersService.massRegister(1, massRegisterUserDtos).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  get massRegister(): FormArray {
    return this.massRegisterForm.get('massRegister') as FormArray;
  }
}
