import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CollaboratorSignalService } from "../collaborator-signal.service";
import { CollaboratorDataService } from "../collaborator-data.service";
import { CollaboratorCreateRequest } from "./create-collaborator";
import { Validators } from "@angular/forms";

@Component({
  selector: 'app-collaborator-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './collaborator-create.component.html',
})
export class CollaboratorCreateComponent {
  collaboratorSignalService = inject(CollaboratorSignalService);
  collaboratorDataService = inject(CollaboratorDataService);

  form = new FormGroup({
    names: new FormControl('', Validators.required),
    surnames: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    deactivationDate: new FormControl(this.formatDate(new Date()), Validators.required),
    collaboratorPeriod: new FormGroup({
      initDate: new FormControl(this.formatDate(new Date()), Validators.required),
      finalDate: new FormControl(this.formatDate(new Date()), Validators.required)
    }),
  });

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.form.invalid) {
      alert("Please fill all required fields.")
      return;
    }

    const formValue = this.form.getRawValue();

    if (!formValue.collaboratorPeriod) return;

    const newCollaborator: CollaboratorCreateRequest = {
      names: formValue.names!,
      surnames: formValue.surnames!,
      email: formValue.email!,
      deactivationDate: new Date(formValue.deactivationDate!),
      periodDateTime: {
        _initDate: new Date(formValue.collaboratorPeriod!.initDate!),
        _finalDate: new Date(formValue.collaboratorPeriod!.finalDate!)
      }
    };


  // O subscribe é necessario porque ao fazeres um pedido http ele retorna um Observable que tem de ser subscrito
  this.collaboratorDataService.createCollaborator(newCollaborator).subscribe({
    next: (createdCollaborator) => {
      console.log('Created collaborator:', createdCollaborator);
      this.collaboratorSignalService.cancelCreateCollaborator?.();
      this.form.reset();
      
    },
    error: (error) => {
      console.error('Error creating collaborator:', error);
    }
  });
}


  onCancel() {
    this.collaboratorSignalService.cancelCreateCollaborator?.();
    this.form.reset();
  }
}
