import { Component, OnInit } from '@angular/core';
import { FreeDay } from 'src/app/models/free-day';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { FreeDaysService } from 'src/app/services/free-days.service';
import { ActivatedRoute } from '@angular/router';

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
  freeDay: FreeDay;
  freeDayTypes = ['NATIONAL', 'COMPANY_HOLIDAY'];
  freeDayEditForm: FormGroup = new FormGroup({
    date: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required)
  });

  constructor(private freeDaysService: FreeDaysService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getFreeDay(this.id);
  }

  getFreeDay(id: number) {
    this.freeDaysService.getFreeDay(id).subscribe(
      freeDay => {
        this.freeDay = JSON.parse(JSON.stringify(freeDay));
        console.log(this.freeDay);
        delete freeDay.id;
        delete freeDay.companyId;
        freeDay.date = new Date(freeDay.date);
        this.freeDayEditForm.setValue(freeDay);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    console.log(this.freeDayEditForm.valid);
    if (this.freeDayEditForm.valid) {
      const freeDay = this.freeDayEditForm.value as FreeDay;
      freeDay.companyId = this.freeDay.companyId;
      this.freeDaysService.updateFreeDay(this.id, freeDay).subscribe(
        editedFreeDay => {
          console.log(editedFreeDay);
          this.getFreeDay(this.id);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
