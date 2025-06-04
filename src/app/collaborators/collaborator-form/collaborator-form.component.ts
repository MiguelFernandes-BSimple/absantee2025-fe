import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorSignalService } from '../collaborator-signal.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Collaborator } from '../collaborator';
@Component({
  selector: 'app-collaborator-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './collaborator-form.component.html',
  styleUrl: './collaborator-form.component.css'
})
export class CollaboratorFormComponent {
  private fb = inject(FormBuilder);
  collaboratorSignalService = inject(CollaboratorSignalService)
  isEditingCollaboratorForm = this.collaboratorSignalService.isEditingCollaborator;
  isCreatingForm = this.collaboratorSignalService.isCreatingCollaborator;

  collaboratorForm: FormGroup;

  constructor(){
    this.collaboratorForm = this.fb.group({
     collabId: [''],
      names: ['', Validators.required],
      surnames: ['', Validators.required],
    });

    effect(() => {
  const collab = this.isEditingCollaboratorForm();
  if (collab) {
    this.collaboratorForm.patchValue(collab);
  } else {
    this.collaboratorForm.reset();
  }
});

  }

    cancel(){
      this.collaboratorSignalService.cancelCreateCollaborator();
      this.collaboratorSignalService.cancelEditCollaborator();
       this.collaboratorForm.reset();
    }

    save() {
      if (this.collaboratorForm.valid) {
        const formValue = this.collaboratorForm.value;

        const collaborator = this.isEditingCollaboratorForm()
          ? { ...this.isEditingCollaboratorForm(), ...formValue }
          : formValue;

      if (this.isCreatingForm()) {
      this.collaboratorSignalService.saveCollaborator(collaborator);
      } else if (this.isEditingCollaboratorForm()) {
      this.collaboratorSignalService.updateCollaborator(collaborator);
      }

    this.collaboratorForm.reset();
  }
}

}
