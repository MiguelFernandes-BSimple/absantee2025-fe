import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AssociationProjectCollaborators, AssociationProjectCollaboratorsDTO, mapToAssociationProjectCollaborators } from "../associations-project-collaborator/association-project-collaborator.model";
import { ProjectCreateRequest } from "./models/create-project.model";
import { Injectable } from "@angular/core";
import { AssociationProjectCollaboratorCreateRequest } from "../associations-project-collaborator/add-collaborator-project/add-association";
import { Project } from "./models/project.model";

@Injectable({ providedIn: 'root' })

export class ProjectsDataService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/Project`)
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/Project/${id}`);
  }

  getAssociations(id: string): Observable<AssociationProjectCollaborators[]> {
    return this.http.get<AssociationProjectCollaboratorsDTO[]>(`${this.baseUrl}/Project/${id}/associations`);
  }

  createProject(newProject: ProjectCreateRequest): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/Project`, newProject);
  }

  updateProject(updatedProject: Project): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/Project`, updatedProject);
  }

  createAssociation(id: string, newAssoc: AssociationProjectCollaboratorCreateRequest): Observable<AssociationProjectCollaborators> {
    return this.http.post<AssociationProjectCollaboratorsDTO>(`${this.baseUrl}/Project/${id}/collaborators`, newAssoc);
  }
}
