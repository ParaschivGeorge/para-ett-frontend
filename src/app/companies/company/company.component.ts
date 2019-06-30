import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { DataHolderService } from 'src/app/services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  editLabel = 'Edit';
  error: string = null;
  editing = false;
  matcher = new MyErrorStateMatcher();
  id: number;
  company: Company;
  companyEditForm: FormGroup = new FormGroup({
    description: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    name: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[a-zA-Z ]*')])
  });

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getCompany(this.id);
    this.companyEditForm.valueChanges.subscribe(
      value => {
        this.error = null;
      }
    );
  }

  getCompany(id: number) {
    this.companiesService.getCompany(id).subscribe(
      company => {
        this.company = JSON.parse(JSON.stringify(company));
        delete company.id;
        this.companyEditForm.setValue(company);
        console.log(company);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.dataHolderService.loading = true;
    this.companiesService.updateCompany(this.id, this.companyEditForm.value as Company).subscribe(
      company => {
        this.getCompany(this.id);
        this.edit();
      },
      error => {
        console.log(error);
        this.error = 'An error has occured while changing your company data!';
      }
    ).add(() => {
      this.dataHolderService.loading = false;
    });
  }

  edit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.companyEditForm.get('name').enable();
      this.companyEditForm.get('description').enable();
      this.editLabel = 'Cancel';
    } else {
      this.companyEditForm.get('name').disable();
      this.companyEditForm.get('description').disable();
      this.editLabel = 'Edit';
    }
  }
}
