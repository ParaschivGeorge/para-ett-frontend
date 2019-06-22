import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/companies.service';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { CompanyRegisterDto } from '../models/company-register-dto';
import { ErrorStateMatcher } from '@angular/material';
import { Company } from '../models/company';
import { OwnerRegisterUserDto } from '../models/owner-register-user-dto';
import { Router } from '@angular/router';
import { DataHolderService } from '../services/data-holder.service';
import { UsersService } from '../services/users.service';

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

  error: string;
  matcher = new MyErrorStateMatcher();
  registerCompanyForm: FormGroup = new FormGroup({
    company: new FormGroup({
      description: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required])
    }),
    ownerRegisterUserDto: new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      freeDaysTotal:  new FormControl(21, [Validators.required, Validators.pattern('[0-9]*')]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      norm: new FormControl(8, [Validators.required, Validators.pattern('[0-9]*')])
    })
  });

  constructor(
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private router: Router,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.registerCompanyForm.valueChanges.subscribe(value => {
      this.error = null;
    });
  }

  onSubmit() {
    console.log(this.registerCompanyForm.valid);
    if (this.registerCompanyForm.valid) {
      const companyRegisterDto: CompanyRegisterDto = this.registerCompanyForm.value as CompanyRegisterDto;
      console.log('crdto: ', companyRegisterDto);
      this.dataHolderService.loading = true;
      this.companiesService.createCompany(companyRegisterDto).subscribe(
        company => {
          console.log(company);
          this.usersService.registerOwner(company.id, companyRegisterDto.ownerRegisterUserDto).subscribe(
            user => {
              this.dataHolderService.email = companyRegisterDto.ownerRegisterUserDto.email;
              this.router.navigate(['email-activation']);
            },
            error => {
              console.log(error);
            }
          );
        },
        error => {
          console.log(error);
          this.error = 'There was a problem processing your request! Please recheck the form or retry later.';
        }
      ).add(
        () => this.dataHolderService.loading = false
      );
    }
  }

}
