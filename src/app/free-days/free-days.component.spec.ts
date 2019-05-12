import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeDaysComponent } from './free-days.component';

describe('FreeDaysComponent', () => {
  let component: FreeDaysComponent;
  let fixture: ComponentFixture<FreeDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
