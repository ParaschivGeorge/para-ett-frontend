import { Component, OnInit } from '@angular/core';
import { DataHolderService } from '../services/data-holder.service';
import { User } from '../models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private dataHolderService: DataHolderService) { }

  ngOnInit() {
  }

  get loading(): boolean {
    return this.dataHolderService.loading;
  }

  get user(): User {
    return this.dataHolderService.user;
  }
}
