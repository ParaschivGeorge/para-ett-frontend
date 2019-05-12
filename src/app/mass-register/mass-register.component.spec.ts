import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MassRegisterComponent } from './mass-register.component';

describe('MassRegisterComponent', () => {
  let component: MassRegisterComponent;
  let fixture: ComponentFixture<MassRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MassRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
