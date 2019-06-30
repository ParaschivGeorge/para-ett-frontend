import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { ActivationComponent } from './activation/activation.component';
import { MassRegisterComponent } from './mass-register/mass-register.component';
import { TimesheetRecordsComponent } from './timesheet-records/timesheet-records.component';
import { TimesheetRecordComponent } from './timesheet-records/timesheet-record/timesheet-record.component';
import { StartComponent } from './start/start.component';
import { CompanyRegisterRedirectComponent } from './company-register-redirect/company-register-redirect.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { NotAuthGuard } from './auth/not-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full'},
  { path: 'start', component: StartComponent, canActivate: [NotAuthGuard]},
  { path: 'email-activation', component: CompanyRegisterRedirectComponent, canActivate: [NotAuthGuard]},
  { path: 'home', component: HomeComponent},
  { path: 'activation', component: ActivationComponent, canActivate: [NotAuthGuard]},
  { path: 'mass-register', component: MassRegisterComponent, canActivate: [AuthGuard], data: {
    roles: ['OWNER']
  }},
  { path: 'companies',
   children: [
    { path: '', component: CompaniesComponent, canActivate: [AuthGuard], data: {
      roles: ['ADMIN']
    }},
    { path: ':id', component: CompanyComponent, canActivate: [AuthGuard], data: {
      roles: ['OWNER']
    }},
  ]},
  { path: 'users',
   children: [
    { path: '', component: UsersComponent, canActivate: [AuthGuard]},
    { path: ':id', component: UserComponent, canActivate: [AuthGuard]},
  ]},
  { path: 'projects',
   children: [
    { path: '', component: ProjectsComponent, canActivate: [AuthGuard]},
    { path: ':id', component: ProjectComponent, canActivate: [AuthGuard]},
  ]},
  { path: 'free-days',
   children: [
    { path: '', component: FreeDaysComponent, canActivate: [AuthGuard]},
    { path: ':id', component: FreeDayComponent, canActivate: [AuthGuard]},
  ]},
  { path: 'leave-requests',
   children: [
    { path: '', component: LeaveRequestsComponent, canActivate: [AuthGuard]},
    { path: ':id', component: LeaveRequestComponent, canActivate: [AuthGuard]},
  ]},
  { path: 'timesheet-records/:userId', component: TimesheetRecordsComponent, canActivate: [AuthGuard] },
  {
    path: 'refresh', component: HomeComponent
  }
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  // { path: 'login', component: LoginComponent},
  // { path: 'admin-incidents', component: AdminIncidentsComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
  // { path: 'not-found', component: ErrorPageComponent},
  // { path: '**', redirectTo: 'not-found' } // this should always be the last route!
  /* { path: '', redirectTo: '/somewhere-else', pathMatch: 'full' }
   * Since the default matching strategy is "prefix",
   *  Angular checks if the path you entered in the URL does start
   *  with the path specified in the route. Of course every path starts with ''.
   * To fix this behavior, you need to change the matching strategy to "full".
   */
];

@NgModule({
  imports: [
      // RouterModule.forRoot(app_Routes, {useHash: true})
      // useHash so your web server doesn't resolve the url before the web client(angular)
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
