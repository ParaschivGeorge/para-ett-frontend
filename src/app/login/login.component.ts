import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorStateMatcher } from '@angular/material';
import { AuthenticationRequest } from '../models/authentication-request';
import * as jwt_decode from "jwt-decode";
import { UsersService } from '../services/users.service';
import { DataHolderService } from '../services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  error: string;

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({email: this.emailFormControl, password: this.passwordFormControl});
    this.loginForm.valueChanges.subscribe(
      value => {
        this.error = null;
        this.loginForm.get('email').setErrors(null);
        this.loginForm.get('password').setErrors(null);
      }
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const authReq = this.loginForm.value as AuthenticationRequest;
      this.dataHolderService.loading = true;
      this.authService.login(authReq).subscribe(
        authResp => {
          console.log(authResp);
          console.log(JSON.parse(jwt_decode(authResp.token).sub));
          this.usersService.getUserByEmail(JSON.parse(jwt_decode(authResp.token).sub).username).subscribe(
            user => {
              console.log(user);
              this.dataHolderService.user = user;
              sessionStorage.setItem('token', authResp.token);
              setTimeout(() => {
                this.router.navigate(['timesheet-records']);
              }, 1000);
            },
            error => {
              console.log(error);
              this.error = 'User data unavailable!';
            }
          ).add(() => {
            this.dataHolderService.loading = false;
          });
        },
        error => {
          this.dataHolderService.loading = false;
          console.log(error);
          this.error = error.error;
          this.loginForm.get('email').setErrors(['invalid']);
          this.loginForm.get('password').setErrors(['invalid']);
        }
      );
    }
  }

}
