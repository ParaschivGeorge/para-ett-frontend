import { Component, OnInit } from '@angular/core';
import { DataHolderService } from '../services/data-holder.service';

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
}
