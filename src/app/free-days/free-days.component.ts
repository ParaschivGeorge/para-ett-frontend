import { Component, OnInit } from '@angular/core';
import { FreeDaysService } from '../services/free-days.service';
import { FreeDay } from '../models/free-day';
import { FormArray, FormControl, FormGroupDirective, NgForm, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

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

  constructor(private freeDaysService: FreeDaysService) { }

  ngOnInit() {
    this.getFreeDays();
  }

  getFreeDays() {
    // TODO: replace with user company id
    this.freeDaysService.getFreeDays(null).subscribe(
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
    const freeDays = this.freeDaysFormArray.value as FreeDay[];
    // TODO replace with user company id
    freeDays.map(freeday => freeday.companyId = 1);
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

  deleteFreeDay(id: number) {
    this.freeDaysService.deleteFreeDay(id).subscribe(
      data => {
        console.log(data);
        this.getFreeDays();
      },
      error => {
        console.log(error);
      }
    );
  }

}
