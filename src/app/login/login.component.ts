import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorStateMatcher } from '@angular/material';
import { AuthenticationRequest } from '../models/authentication-request';

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

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({email: this.emailFormControl, password: this.passwordFormControl});
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const authReq = this.loginForm.value as AuthenticationRequest;
      this.authService.login(authReq).subscribe(
        authResp => {
          console.log(authResp);
          sessionStorage.setItem('token', authResp.token);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
