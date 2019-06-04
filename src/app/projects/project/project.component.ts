import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormArray, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { ProjectDto } from 'src/app/models/project-dto';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { DataHolderService } from 'src/app/services/data-holder.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  users: User[] = [];
  matcher = new MyErrorStateMatcher();
  id: number;
  project: Project;
  projectEditForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    responsibleId: new FormControl(null, [Validators.required]),
    users: new FormArray([])
  });

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private dataHolderService: DataHolderService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getProject(this.id);
  }

  getProject(id: number) {
    this.projectsService.getProject(id).subscribe(
      project => {
        this.project = JSON.parse(JSON.stringify(project));
        console.log(this.project);
        delete project.companyId;
        delete project.id;
        const users: User[] = JSON.parse(JSON.stringify(project.users));
        this.removeAllUsers();
        project.users = [];
        this.projectEditForm.setValue(project);
        users.forEach(user => {
          this.addUser(user.id);
        });
        this.getUsers();
      },
      error => {
        console.log(error);
      }
    );
  }

  get usersFormArray(): FormArray {
    return this.projectEditForm.get('users') as FormArray;
  }

  addUser(userId: number) {
    if (this.projectEditForm.valid) {
      this.usersFormArray.push(new FormControl(userId, Validators.required));
    }
  }

  removeUser(index: number) {
    this.usersFormArray.removeAt(index);
  }

  onSubmit() {
    console.log(this.projectEditForm.valid);
    if (this.projectEditForm.valid) {
      const projectDto = this.projectEditForm.value as ProjectDto;
      projectDto.companyId = this.dataHolderService.user.companyId;
      this.projectsService.updateProject(this.id, projectDto).subscribe(
        project => {
          console.log(project);
          this.getProject(this.id);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  private removeAllUsers() {
    for (let index = this.usersFormArray.length - 1; index >= 0; index--) {
      this.removeUser(index);
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

}
