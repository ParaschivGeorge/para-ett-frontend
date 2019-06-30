import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project';
import { FormArray, FormControl, Validators, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ProjectDto } from '../models/project-dto';
import { DataHolderService } from '../services/data-holder.service';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  matcher = new MyErrorStateMatcher();
  users: User[] = [];

  loadingRequests = 0;

  projectCreateForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    responsibleId: new FormControl(null, [Validators.required]),
    users: new FormArray([])
  });

  constructor(
    private projectsService: ProjectsService,
    private dataHolderService: DataHolderService,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.projectsService.getProjects(this.dataHolderService.user.companyId, null, null).subscribe(
      projects => {
        this.projects = projects;
        this.getUsers();
        console.log(projects);
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  getUsers() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
      users => {
        this.users = users;
        console.log(users);
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  deleteProject(id: number) {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.projectsService.deleteProject(id).subscribe(
      data => {
        console.log(data);
        this.getProjects();
      },
      error => {
        console.log(error);
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  getUserData(id: number) {
    const user = this.users.filter(u => u.id === id)[0];
    if (user) {
      return user.firstName + ' ' + user.lastName + ' ' + user.email;
    }
    return null;
  }

  get usersFormArray(): FormArray {
    return this.projectCreateForm.get('users') as FormArray;
  }

  addUser() {
    if (this.projectCreateForm.valid) {
      this.usersFormArray.push(new FormControl(null, Validators.required));
    }
  }

  removeUser() {
    this.usersFormArray.removeAt(this.usersFormArray.length - 1);
  }

  canEditOrDelete(responsibleId: number) {
    return this.dataHolderService.user.type === 'OWNER' || this.dataHolderService.user.id === responsibleId;
  }

  onSubmit() {
    console.log(this.projectCreateForm.valid);
    if (this.projectCreateForm.valid) {
      const projectDto = this.projectCreateForm.value as ProjectDto;
      projectDto.companyId = this.dataHolderService.user.companyId;
      this.dataHolderService.loading = true;
      this.loadingRequests++;
      this.projectsService.createProject(projectDto).subscribe(
        data => {
          console.log(data);
          this.getProjects();
        },
        error => {
          console.log(error);
        }
      ).add(() => {
        this.loadingRequests--;
        if (this.loadingRequests === 0) {
          this.dataHolderService.loading = false;
        }
      });
    }
  }

}
