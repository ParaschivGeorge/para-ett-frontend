import { Component, OnInit, Input } from '@angular/core';
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
    this.dataHolderService.loading = true;
    this.freeDaysService.getFreeDays(this.dataHolderService.user.companyId).subscribe(
      freeDays => {
        this.freeDays = freeDays;
        console.log(freeDays);
      },
      error => {
        console.log(error);
      }
    ).add(() => this.dataHolderService.loading = false);
  }

  get freeDaysFormArray(): FormArray {
    return this.freeDaysCreateForm.get('freeDays') as FormArray;
  }

  addFreeDay() {
    if (this.freeDaysCreateForm.valid) {
      this.freeDaysFormArray.push(
        new FormGroup({
          date: new FormControl(null, [Validators.required]),
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
      this.dataHolderService.loading = true;
      this.freeDaysService.createFreeDays(freeDays).subscribe(
        createdFreeDays => {
          console.log(createdFreeDays);
          this.freeDaysCreateForm = new FormGroup({
            freeDays: new FormArray([])
          });
          this.getFreeDays();
        },
        error => {
          console.log(error);
        }
      ).add(() => this.dataHolderService.loading = false);
    }
  }

  deleteFreeDay(id: number) {
    console.log(id);
    this.dataHolderService.loading = true;
    this.freeDaysService.deleteFreeDay(id).subscribe(
      data => {
        console.log(data);
        this.getFreeDays();
      },
      error => {
        console.log(error);
      }
    ).add(() => this.dataHolderService.loading = false);
  }

  isOwner() {
    return this.dataHolderService.user && this.dataHolderService.user.type === 'OWNER';
  }
}
