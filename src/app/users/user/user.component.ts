import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  id: number;
  user: User;
  userTypes = ['EMPLOYEE', 'MANAGER', 'HR'];
  userEditForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    freeDaysLeft: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
    lastName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    managerId: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
    norm: new FormControl(null, [Validators.required, Validators.pattern('[0-9]*')]),
    type: new FormControl(null, [Validators.required])
  });
  projects: Project[] = [];

  constructor(private usersService: UsersService, private projectsService: ProjectsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getUser(this.id);
  }

  getUser(id: number) {
    this.usersService.getUser(id).subscribe(
      user => {
        this.user = JSON.parse(JSON.stringify(user));
        console.log(this.user);
        delete user.id;
        delete user.companyId;
        delete user.email;
        delete user.projects;
        delete user.lastLoginDate;
        this.userEditForm.setValue(user);
        this.getProjects(this.user.companyId, this.user.id);
      },
      error => {
        console.log(error);
      }
    );
  }

  getProjects(companyId: number, responsibleId: number) {
    this.projectsService.getProjects(companyId, responsibleId).subscribe(
      projects => {
        this.projects = projects;
        console.log(projects);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.usersService.updateUser(this.id, this.userEditForm.value as User).subscribe(
      company => {
        this.getUser(this.id);
      },
      error => {
        console.log(error);
      }
    );
  }

}
