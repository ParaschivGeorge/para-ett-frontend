import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FreeDay } from 'src/app/models/free-day';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { FreeDaysService } from 'src/app/services/free-days.service';
import { ActivatedRoute } from '@angular/router';
import { DataHolderService } from 'src/app/services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-free-day',
  templateUrl: './free-day.component.html',
  styleUrls: ['./free-day.component.css']
})
export class FreeDayComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  id: number;
  @Input() freeDay: FreeDay;
  @Output() deleteEmitter: EventEmitter<number> = new EventEmitter<number>();
  freeDayTypes = ['NATIONAL', 'COMPANY_HOLIDAY'];
  freeDayEditForm: FormGroup = new FormGroup({
    date: new FormControl({value: null}, Validators.required),
    type: new FormControl({value: null}, Validators.required)
  });

  constructor(
    private freeDaysService: FreeDaysService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    if (this.freeDay) {
      this.id = this.freeDay.id;
      this.freeDay.date = new Date(this.freeDay.date);
      const freeDay = JSON.parse(JSON.stringify(this.freeDay));
      delete freeDay.id;
      delete freeDay.companyId;
      freeDay.date = new Date(freeDay.date);
      this.freeDayEditForm.setValue(freeDay);
      if (this.isOwner()) {
        this.freeDayEditForm.enable();
      } else {
        this.freeDayEditForm.disable();
      }
    }
  }

  getFreeDay(id: number) {
    this.dataHolderService.loading = true;
    this.freeDaysService.getFreeDay(id).subscribe(
      freeDay => {
        this.freeDay = JSON.parse(JSON.stringify(freeDay));
        delete freeDay.id;
        delete freeDay.companyId;
        freeDay.date = new Date(freeDay.date);
        this.freeDayEditForm.setValue(freeDay);
        if (this.isOwner()) {
          this.freeDayEditForm.enable();
        } else {
          this.freeDayEditForm.disable();
        }
      },
      error => {
        console.log(error);
      }
    ).add(() => this.dataHolderService.loading = false);
  }

  onSubmit() {
    console.log(this.freeDayEditForm.valid);
    if (this.freeDayEditForm.valid) {
      const freeDay = this.freeDayEditForm.value as FreeDay;
      freeDay.id = this.id;
      freeDay.companyId = this.freeDay.companyId;
      this.dataHolderService.loading = true;
      this.freeDaysService.updateFreeDay(this.id, freeDay).subscribe(
        editedFreeDay => {
          this.getFreeDay(this.id);
        },
        error => {
          console.log(error);
        }
      ).add(() => this.dataHolderService.loading = false);
    }
  }

  deleteFreeDay(id: number) {
    this.deleteEmitter.emit(id);
  }

  isOwner() {
    return this.dataHolderService.user && this.dataHolderService.user.type === 'OWNER';
  }

}
