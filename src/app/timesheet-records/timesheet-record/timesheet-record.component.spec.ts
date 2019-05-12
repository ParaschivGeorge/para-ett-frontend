import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetRecordComponent } from './timesheet-record.component';

describe('TimesheetRecordComponent', () => {
  let component: TimesheetRecordComponent;
  let fixture: ComponentFixture<TimesheetRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
