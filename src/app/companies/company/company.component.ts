import { Component, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/models/company';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  matcher = new MyErrorStateMatcher();
  id: number;
  company: Company;
  companyEditForm: FormGroup = new FormGroup({
    description: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required])
  });

  constructor(private companiesService: CompaniesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getCompany(this.id);
  }

  getCompany(id: number) {
    this.companiesService.getCompany(id).subscribe(
      company => {
        this.company = company;
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
    this.companiesService.updateCompany(this.id, this.companyEditForm.value as Company).subscribe(
      company => {
        this.getCompany(this.id);
      },
      error => {
        console.log(error);
      }
    );
  }

}
