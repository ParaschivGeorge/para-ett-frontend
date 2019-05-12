import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeDayComponent } from './free-day.component';

describe('FreeDayComponent', () => {
  let component: FreeDayComponent;
  let fixture: ComponentFixture<FreeDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
