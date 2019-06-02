import { Component, OnInit } from '@angular/core';
import { DataHolderService } from '../services/data-holder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-register-redirect',
  templateUrl: './company-register-redirect.component.html',
  styleUrls: ['./company-register-redirect.component.css']
})
export class CompanyRegisterRedirectComponent implements OnInit {

  email: string;

  constructor(private dataHolderService: DataHolderService, private router : Router) { }

  ngOnInit() {
    this.email = this.dataHolderService.email;
    if (this.email == null) {
      this.router.navigate(['home']);
    }
  }

}
