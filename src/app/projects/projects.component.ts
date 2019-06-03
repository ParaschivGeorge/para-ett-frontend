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

  projectCreateForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
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
    if (this.dataHolderService.user) {
      this.dataHolderService.loading = true;
      this.projectsService.getProjects(this.dataHolderService.user.companyId, null).subscribe(
        projects => {
          this.projects = projects;
          this.getUsers();
          console.log(projects);
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    } else {
      this.router.navigate(['start']);
    }
  }

  getUsers() {
    if (this.dataHolderService.user) {
      this.dataHolderService.loading = true;
      this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
        users => {
          this.users = users;
          console.log(users);
        },
        error => {
          console.log(error);
        }
      ).add(() => {
        this.dataHolderService.loading = false;
      });
    } else {
      this.router.navigate(['start']);
    }
  }

  deleteProject(id: number) {
    this.projectsService.deleteProject(id).subscribe(
      data => {
        console.log(data);
        this.getProjects();
      },
      error => {
        console.log(error);
      }
    );
  }

  get usersFormArray(): FormArray {
    return this.projectCreateForm.get('users') as FormArray;
  }

  addUser() {
    this.usersFormArray.push(new FormControl(null ,Validators.required));
  }

  removeUser() {
    this.usersFormArray.removeAt(this.usersFormArray.length - 1);
  }

  onSubmit() {
    console.log(this.projectCreateForm.valid);
    if (this.projectCreateForm.valid) {
      const projectDto = this.projectCreateForm.value as ProjectDto;
      projectDto.companyId = this.dataHolderService.user.companyId;
      this.projectsService.createProject(projectDto).subscribe(
        data => {
          console.log(data);
          this.getProjects();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

}
