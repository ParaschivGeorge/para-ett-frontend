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

const routes: Routes = [
  { path: 'register-company', component: RegisterCompanyComponent},
  { path: 'activation', component: ActivationComponent},
  { path: 'mass-register', component: MassRegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'companies',
   children: [
    { path: '', component: CompaniesComponent},
    { path: ':id', component: CompanyComponent},
  ]},
  { path: 'users',
   children: [
    { path: '', component: UsersComponent},
    { path: ':id', component: UserComponent},
  ]},
  { path: 'projects',
   children: [
    { path: '', component: ProjectsComponent},
    { path: ':id', component: ProjectComponent},
  ]},
  { path: 'free-days',
   children: [
    { path: '', component: FreeDaysComponent},
    { path: ':id', component: FreeDayComponent},
  ]},
  { path: 'leave-requests',
   children: [
    { path: '', component: LeaveRequestsComponent},
    { path: ':id', component: LeaveRequestComponent},
  ]},
  { path: 'timesheet-records',
   children: [
    { path: '', component: LeaveRequestsComponent},
    { path: ':id', component: LeaveRequestComponent},
  ]},
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
