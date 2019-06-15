import { Component, OnInit } from '@angular/core';
import { DataHolderService } from '../services/data-holder.service';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  activeRoute = '';

  constructor(private dataHolderService: DataHolderService) { }

  ngOnInit() {
  }

  get loading(): boolean {
    return this.dataHolderService.loading;
  }

  get user(): User {
    return this.dataHolderService.user;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.dataHolderService.user = null;
  }
}
