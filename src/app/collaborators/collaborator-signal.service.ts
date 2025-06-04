import { Injectable, signal } from '@angular/core';
import { Collaborator } from './collaborator';
import { CollaboratorCreateRequest } from './collaborators-create/create-collaborator';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorSignalService {
  //private httpClient = inject(HttpClient);

  private updateCollaboratorSignal = signal<Collaborator | undefined>(undefined);
  readonly updatedCollaborator = this.updateCollaboratorSignal.asReadonly();

  private selectedCollaboratorSignal = signal<Collaborator | undefined>(undefined);
  readonly selectedCollaborator = this.selectedCollaboratorSignal.asReadonly();

  private selectedCollaboratorHolidaysSignal = signal<Collaborator | undefined>(undefined);
  readonly selectedCollaboratorHoliday = this.selectedCollaboratorHolidaysSignal.asReadonly();

  private selectedCollaboratorProjectsSignal = signal<Collaborator | undefined>(undefined);
  readonly selectedCollaboratorProjects = this.selectedCollaboratorProjectsSignal.asReadonly();

  private isCreatingCollaboratorSignal = signal(false);
  readonly isCreatingCollaborator = this.isCreatingCollaboratorSignal.asReadonly();
  
  private createdCollaboratorSignal = signal<Collaborator  | undefined>(undefined);
  readonly createdCollaborator = this.createdCollaboratorSignal.asReadonly();
  private creatingCollaboratorSignal = signal<Collaborator  | undefined>(undefined);
  readonly creatingCollaborator = this.creatingCollaboratorSignal.asReadonly();

  private isEditingCollaboratorSignal = signal<Collaborator | undefined>(undefined);
  readonly isEditingCollaborator = this.isEditingCollaboratorSignal.asReadonly();

  updateCollaborator(updated: Collaborator) {
    this.updateCollaboratorSignal.set(updated);
    this.cancelEditCollaborator();
  }

  startCreateCollaborator() {
    this.isCreatingCollaboratorSignal.set(true);
  }

  
  selectCollaborator(selected: Collaborator | undefined){
    this.selectedCollaboratorHolidaysSignal.set(undefined);
    this.selectedCollaboratorProjectsSignal.set(undefined);
    this.selectedCollaboratorSignal.set(selected);
  }

  selectCollaboratorHolidays(selected: Collaborator | undefined){
    this.selectedCollaboratorSignal.set(undefined);
    this.selectedCollaboratorProjectsSignal.set(undefined);
    this.selectedCollaboratorHolidaysSignal.set(selected);
  }

  selectCollaboratorProjects(selected: Collaborator | undefined){
    this.selectedCollaboratorSignal.set(undefined);
    this.selectedCollaboratorHolidaysSignal.set(undefined);
    this.selectedCollaboratorProjectsSignal.set(selected);
  }

  disableCollaboratorDetails(){
    this.selectedCollaboratorProjectsSignal.set(undefined);
    }


  saveCollaborator(collaborator: Collaborator){
    this.creatingCollaboratorSignal.set(collaborator);
    this.cancelCreateCollaborator();
    }

  createCollaborator(){
    this.isCreatingCollaboratorSignal.set(true);
    }

  cancelCreateCollaborator() {
    this.isCreatingCollaboratorSignal.set(false);
    }

  cancelEditCollaborator(){
    this.isEditingCollaboratorSignal.set(undefined);
    }
}
