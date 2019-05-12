import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) { }

  // TODO: add create method

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

}
