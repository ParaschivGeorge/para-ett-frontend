import { Component, OnInit } from '@angular/core';
import { FreeDaysService } from '../services/free-days.service';
import { FreeDay } from '../models/free-day';
import { FormArray, FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { DataHolderService } from '../services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-free-days',
  templateUrl: './free-days.component.html',
  styleUrls: ['./free-days.component.css']
})
export class FreeDaysComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  freeDays: FreeDay[] = [];
  freeDaysCreateForm: FormGroup = new FormGroup({
    freeDays: new FormArray([])
  });
  freeDayTypes = ['NATIONAL', 'COMPANY_HOLIDAY'];

  constructor(
    private freeDaysService: FreeDaysService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.getFreeDays();
  }

  getFreeDays() {
    this.freeDaysService.getFreeDays(this.dataHolderService.user.companyId).subscribe(
      freeDays => {
        this.freeDays = freeDays;
        console.log(freeDays);
      },
      error => {
        console.log(error);
      }
    );
  }

  get freeDaysFormArray(): FormArray {
    return this.freeDaysCreateForm.get('freeDays') as FormArray;
  }

  addFreeDay() {
    if (this.freeDaysCreateForm.valid) {
      this.freeDaysFormArray.push(
        new FormGroup({
          date: new FormControl(null, Validators.required),
          type: new FormControl(null, Validators.required)
        })
      );
    }
  }

  removeFreeDay(index: number) {
    this.freeDaysFormArray.removeAt(index);
  }

  onSubmit() {
    if (this.freeDaysCreateForm.valid) {
      const freeDays = this.freeDaysFormArray.value as FreeDay[];
      freeDays.map(freeday => freeday.companyId = this.dataHolderService.user.companyId);
      console.log(freeDays);
      this.freeDaysService.createFreeDays(freeDays).subscribe(
        createdFreeDays => {
          console.log(createdFreeDays);
          this.getFreeDays();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
