import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { DataHolderService } from 'src/app/services/data-holder.service';

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
  userTypes = ['EMPLOYEE', 'MANAGER', 'HR', 'OWNER'];
  userEditForm: FormGroup = new FormGroup({
    firstName: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    freeDaysLeft: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[0-9]*')]),
    lastName: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    managerId: new FormControl({value: null, disabled: true}, [Validators.pattern('[0-9]*')]),
    norm: new FormControl({value: null, disabled: true}, [Validators.required, Validators.pattern('[0-9]*')]),
    type: new FormControl({value: null, disabled: true}, [Validators.required])
  });
  projects: Project[] = [];
  users: User[] = [];
  editing = false;
  editLabel = 'Edit';
  loadingRequests = 0;

  constructor(
    private usersService: UsersService,
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private dataHolderService: DataHolderService,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.getUser(this.id);
  }

  edit() {
    this.editing = !this.editing;
    if (this.editing) {
      this.editLabel = 'Cancel';
      if (this.isCurrentUser()) {
        this.userEditForm.get('firstName').enable();
        this.userEditForm.get('lastName').enable();
      }
      if (this.isHR()) {
        this.userEditForm.get('norm').enable();
        this.userEditForm.get('freeDaysLeft').enable();
      }
      if (this.isOwner()) {
        this.userEditForm.get('managerId').enable();
        this.userEditForm.get('norm').enable();
        this.userEditForm.get('freeDaysLeft').enable();
      }
    } else {
      this.editLabel = 'Edit';
      this.userEditForm.disable();
    }
  }

  getUser(id: number) {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.usersService.getAllUsers(this.dataHolderService.user.companyId, null).subscribe(
      users => {
        this.users = users;
        this.user = users.filter(u => u.id == id)[0];
        const user = JSON.parse(JSON.stringify(this.user));
        delete user.id;
        delete user.companyId;
        delete user.email;
        delete user.projects;
        delete user.lastLoginDate;
        this.userEditForm.setValue(user);
        this.getProjects(this.user.companyId, id);
      },
      error => {
        console.log(error);
        this.dataHolderService.loading = false;
      }
    ).add(() => {
      this.loadingRequests--;
      if (this.loadingRequests === 0) {
        this.dataHolderService.loading = false;
      }
    });
  }

  getProjects(companyId: number, userId: number) {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.projectsService.getProjects(companyId, null, userId).subscribe(
      projects => {
        this.dataHolderService.loading = true;
        this.loadingRequests++;
        this.projectsService.getProjects(companyId, userId, null).subscribe(
          projectsR => {
            this.projects = projects.concat(projectsR);
            console.log(this.projects);
          },
          error => {{
            console.log(error);
          }}
        ).add(() => {
          this.loadingRequests--;
          if (this.loadingRequests === 0) {
            this.dataHolderService.loading = false;
          }
        });
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

  onSubmit() {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.usersService.updateUser(this.id, this.userEditForm.value as User).subscribe(
      user => {
        this.getUser(this.id);
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

  isCurrentUser(): boolean {
    return this.dataHolderService.user && this.dataHolderService.user.id == this.id;
  }

  isOwner(): boolean {
    return this.dataHolderService.user && this.dataHolderService.user.type === 'OWNER';
  }

  isHR(): boolean {
    return this.dataHolderService.user && this.dataHolderService.user.type === 'HR';
  }

  get dhUser(): User {
    return this.dataHolderService.user;
  }

  deleteUser(id: number) {
    this.dataHolderService.loading = true;
    this.loadingRequests++;
    this.usersService.deleteUser(id).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/users']);
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

  canEdit() {
    return this.isCurrentUser() || this.isHR() || this.isOwner();
  }

  getManagers(): User[] {
    const users = [];
    this.users.forEach(user => {
      if (user.type === 'MANAGER' || user.type === 'OWNER') {
        users.push(user);
      }
    });
    return users;
  }

  getUserData(id: number) {
    const user = this.users.filter(u => u.id === id)[0];
    return user.firstName + ' ' + user.lastName + ' ' + user.email;
  }

  canEditOrDelete(responsibleId: number) {
    return this.dataHolderService.user.type === 'OWNER' || this.dataHolderService.user.id === responsibleId;
  }
}
