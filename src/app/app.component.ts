import { Component, OnInit } from '@angular/core';
import { DataHolderService } from './services/data-holder.service';
import { UsersService } from './services/users.service';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'para-ett-frontend';
}
