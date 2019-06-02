import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TokenInterceptorService } from './auth/token-interceptor.service';
import { AuthGuard } from './auth/auth.guard';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { LoginComponent } from './login/login.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyComponent } from './companies/company/company.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user/user.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './projects/project/project.component';
import { FreeDaysComponent } from './free-days/free-days.component';
import { FreeDayComponent } from './free-days/free-day/free-day.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { LeaveRequestComponent } from './leave-requests/leave-request/leave-request.component';
import { TimesheetRecordsComponent } from './timesheet-records/timesheet-records.component';
import { TimesheetRecordComponent } from './timesheet-records/timesheet-record/timesheet-record.component';
import { ActivationComponent } from './activation/activation.component';
import { MassRegisterComponent } from './mass-register/mass-register.component';
import { StartComponent } from './start/start.component';
import { CompanyRegisterRedirectComponent } from './company-register-redirect/company-register-redirect.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    RegisterCompanyComponent,
    LoginComponent,
    CompaniesComponent,
    CompanyComponent,
    UsersComponent,
    UserComponent,
    ProjectsComponent,
    ProjectComponent,
    FreeDaysComponent,
    FreeDayComponent,
    LeaveRequestsComponent,
    LeaveRequestComponent,
    TimesheetRecordsComponent,
    TimesheetRecordComponent,
    ActivationComponent,
    MassRegisterComponent,
    StartComponent,
    CompanyRegisterRedirectComponent,
    HomeComponent
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
