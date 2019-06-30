import { Component, OnInit, ViewChild } from '@angular/core';
import { DataHolderService } from '../services/data-holder.service';
import { User } from '../models/user';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, filter, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @ViewChild('sidenav') drawer: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  activeRoute = '';

  constructor(private breakpointObserver: BreakpointObserver, private dataHolderService: DataHolderService, private router: Router) {
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer.close());
   }

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
    this.router.navigateByUrl('');
  }
}
