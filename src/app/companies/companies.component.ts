import { Component, OnInit } from '@angular/core';
import { CompaniesService } from '../services/companies.service';
import { Company } from '../models/company';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  companies: Company[] = [];

  constructor(private companiesService: CompaniesService) { }

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.companiesService.getAllCompanies().subscribe(
      companies => {
        this.companies = companies;
        console.log(companies);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteCompany(id: number) {
    this.companiesService.deleteCompany(id).subscribe(
      data => {
        console.log(data);
        this.getCompanies();
      },
      error => {
        console.log(error);
      }
    );
  }

}
