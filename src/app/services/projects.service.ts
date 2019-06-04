import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { ProjectDto } from '../models/project-dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projectsServiceUrl = environment.apiUrl + '/users-service/projects';

  constructor(private http: HttpClient) { }

  createProject(projectDto: ProjectDto): Observable<Project> {
    return this.http.post<Project>(this.projectsServiceUrl, projectDto);
  }

  getProjects(companyId: number, responsibleId: number, userId: number): Observable<Project[]> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    if (responsibleId) {
      queryParam = queryParam.append('responsibleId', responsibleId.toString());
    }
    if (userId) {
      queryParam = queryParam.append('userId', userId.toString());
    }
    return this.http.get<Project[]>(this.projectsServiceUrl, {params : queryParam});
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(this.projectsServiceUrl + '/' + id);
  }

  updateProject(id: number, projectDto: ProjectDto): Observable<Project> {
    return this.http.put<Project>(this.projectsServiceUrl + '/' + id, projectDto);
  }

  deleteProject(id: number): Observable<null> {
    return this.http.delete<null>(this.projectsServiceUrl + '/' + id);
  }

  deleteProjects(companyId: number): Observable<null> {
    let queryParam = new HttpParams();
    if (companyId) {
      queryParam = queryParam.append('companyId', companyId.toString());
    }
    return this.http.delete<null>(this.projectsServiceUrl, {params : queryParam});
  }
}
