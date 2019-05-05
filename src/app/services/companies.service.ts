import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company';
import { CompanyRegisterDto } from '../models/company-register-dto';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  companiesServiceUrl = environment.apiUrl + '/companies-service/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companiesServiceUrl);
  }

  createCompany(companyRegisterDto: CompanyRegisterDto): Observable<Company> {
    return this.http.post<Company>(this.companiesServiceUrl, companyRegisterDto);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(this.companiesServiceUrl + '/' + id);
  }

  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(this.companiesServiceUrl + '/' + id, company);
  }

  deleteCompany(id: number): Observable<null> {
    return this.http.delete<null>(this.companiesServiceUrl + '/' + id);
  }
}
