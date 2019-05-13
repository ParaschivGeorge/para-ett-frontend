import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project';
import { FormArray, FormControl, Validators, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ProjectDto } from '../models/project-dto';

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

  projectCreateForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    responsibleId: new FormControl(null, [Validators.required]),
    users: new FormArray([])
  });

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    // TODO provide user company id
    this.projectsService.getProjects(null, null).subscribe(
      projects => {
        this.projects = projects;
        console.log(projects);
      }
    );
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
      projectDto.companyId = 1; // TODO set user company id
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
