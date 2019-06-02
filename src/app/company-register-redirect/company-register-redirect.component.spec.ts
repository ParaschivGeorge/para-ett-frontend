import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegisterRedirectComponent } from './company-register-redirect.component';

describe('CompanyRegisterRedirectComponent', () => {
  let component: CompanyRegisterRedirectComponent;
  let fixture: ComponentFixture<CompanyRegisterRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyRegisterRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRegisterRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
