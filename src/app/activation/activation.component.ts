import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountActivationUserDto } from '../models/account-activation-user-dto';
import { UsersService } from '../services/users.service';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { CompanyRegisterDto } from '../models/company-register-dto';
import { DataHolderService } from '../services/data-holder.service';
import { AuthService } from '../services/auth.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {

  code: string;
  email: string;
  error: string = null;
  matcher = new MyErrorStateMatcher();

  passwordFormControl = new FormControl('', [
    Validators.required,
    // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
  ]);

  accountActivationForm: FormGroup = new FormGroup({    
    password: this.passwordFormControl,
    passwordConfirm: new FormControl('', [
      Validators.required,
      this.passwordConfirmValidator.bind(this)
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private dataHolderService: DataHolderService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      console.log(params.code)
      if (params.code !== null && params.email != null) {
        this.email = params.email;
        this.code = params.code;
      }
    });
  }

  passwordConfirmValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value === this.passwordFormControl.value) {return null; }
    return {'passwordsNotMatching': true};
  }

  onSubmit() {
    console.log(this.accountActivationForm.valid);
    if (this.accountActivationForm.valid) {
      const accountActivationUserDto: AccountActivationUserDto = {
        password: this.accountActivationForm.get('password').value,
        email: this.email,
        activationCode: this.code
      };
      console.log('AAUdto: ', accountActivationUserDto);
      this.dataHolderService.loading = true;
      this.usersService.activateAccount(accountActivationUserDto).subscribe(
        user => {
          console.log(user);
          this.dataHolderService.user = user;
          this.authService.login({email: user.email, password: accountActivationUserDto.password}).subscribe(
            authResp => {
              sessionStorage.setItem('token', authResp.token);
              setTimeout(() => {
                this.router.navigate(['timesheet-records']);
              }, 1000);
            },
            error => {
              this.dataHolderService.user = null;
              this.error = 'Authentification failed! Redirecting home...';
              setTimeout(() => {
                this.router.navigate(['home']);
              }, 1000);
            }
          );
        },
        error => {
          console.log(error);
          this.error = 'Activation failed!';
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    }
  }

}
