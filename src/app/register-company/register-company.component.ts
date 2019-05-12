import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/companies.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { CompanyRegisterDto } from '../models/company-register-dto';
import { ErrorStateMatcher } from '@angular/material';
import { Company } from '../models/company';
import { OwnerRegisterUserDto } from '../models/owner-register-user-dto';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  passwordFormControl = new FormControl('', [
    Validators.required,
    // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
  ]);

  registerCompanyForm: FormGroup = new FormGroup({
    company: new FormGroup({
      description: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required])
    }),
    ownerRegisterUserDto: new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      freeDaysTotal:  new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      norm: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
      password: this.passwordFormControl,
      passwordConfirm: new FormControl('', [
        Validators.required,
        this.passwordConfirmValidator.bind(this)
      ])
    })
  });

  passwordConfirmValidator(control: FormControl): {[s: string]: boolean} {
    if (control.value === this.passwordFormControl.value) {return null; }
    return {'passwordsNotMatching': true};
  }

  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.registerCompanyForm.valid);
    if (this.registerCompanyForm.valid) {
      const companyRegisterDto: CompanyRegisterDto = this.registerCompanyForm.value as CompanyRegisterDto;
      console.log('crdto: ', companyRegisterDto);
      this.companiesService.createCompany(companyRegisterDto).subscribe(
        data => {
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
