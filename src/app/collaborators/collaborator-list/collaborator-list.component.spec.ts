import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollaboratorListComponent } from './collaborator-list.component';
import { CollaboratorViewModel } from '../collaborator-details/collaborator.viewmodel';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { CollaboratorHolidaysComponent } from '../collaborator-holidays/collaborator-holidays.component';
import { AssociationsProjectCollaboratorComponent } from '../../associations-project-collaborator/associations-project-collaborator.component';
import { Location } from '@angular/common';


describe('CollaboratorListComponent', () => {
  let component: CollaboratorListComponent;
  let fixture: ComponentFixture<CollaboratorListComponent>;
  let collaborators: CollaboratorViewModel [];

  let router: Router;
  let location: Location;

  beforeEach(async () => {
    collaborators = [
      { 
       collabId: "0196b4ee-a7fc-750f-a698-6a5dfd27ce71",
       userId: "37726a9c-7246-4074-bd06-f2a58b494230",
       names: "John",
       surnames: "Doe",
       email: "john.doe@example.com",
       userPeriod: {
         _initDate: new Date("2022-05-28T13:07:27.358Z"),
         _finalDate: new Date("2027-05-28T13:07:27.358Z")
       },
       collaboratorPeriod: {
         _initDate: new Date("2023-05-28T13:07:27.358Z"),
         _finalDate: new Date("2026-05-28T13:07:27.358Z")
       }
     },
     { 
       collabId: "b2c7e5d1-8f3a-4c2e-9a1b-2e5d7f8c9b10",
       userId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
       names: "Jane",
       surnames: "Smith",
       email: "jane.smith@example.com",
       userPeriod: {
         _initDate: new Date("2021-03-15T09:00:00.000Z"),
         _finalDate: new Date("2026-03-15T09:00:00.000Z")
       },
       collaboratorPeriod: {
         _initDate: new Date("2022-04-01T08:30:00.000Z"),
         _finalDate: new Date("2025-04-01T08:30:00.000Z")
       }
     }
   ];
  

    await TestBed.configureTestingModule({
      imports: [CollaboratorListComponent], 
      providers: [
        provideRouter([
          { path: 'holidays/:collabId', component: CollaboratorHolidaysComponent },
          { path: 'associations/:collabId', component: AssociationsProjectCollaboratorComponent }
        ]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CollaboratorListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('inputCollabs', collaborators);
    fixture.detectChanges();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the filters form when showFilters is true', () => {
    component.showFilters = true;
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form.search-form');
    expect(form).toBeTruthy();

    const nameInput = form.querySelector('input[formControlName="name"]');
    const emailInput = form.querySelector('input[formControlName="email"]');
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  it('should hide the filters form when showFilters is false', () => {
    component.showFilters = false;
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form.search-form');
    expect(form).toBeFalsy();
  });

  it('should toggle showFilters when the Show Filters button is clicked', () => {
    component.showFilters = false;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(component.showFilters).toBeTrue();
    button.click();
    fixture.detectChanges();
    expect(component.showFilters).toBeFalse();
  });

  it('should filter collaborators by name', () => {
    component.showFilters = true;
    fixture.detectChanges();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="name"]');
    nameInput.value = 'Jane';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.collaborators.length).toBe(1);
    expect(component.collaborators[0].names).toBe('Jane');
  });

  it('should filter collaborators by email', () => {
    component.showFilters = true;
    fixture.detectChanges();

    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailInput.value = 'john.doe@example.com';
    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.collaborators.length).toBe(1);
    expect(component.collaborators[0].email).toBe('john.doe@example.com');
  });

  it('should filter collaborators by name and email together', () => {
    component.showFilters = true;
    fixture.detectChanges();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="name"]');

    const emailInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="email"]');

    nameInput.value = 'Jane';
    nameInput.dispatchEvent(new Event('input'));
    
    emailInput.value = 'jane.smith@example.com';
    emailInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(component.collaborators.length).toBe(1);
    expect(component.collaborators[0].names).toBe('Jane');
    expect(component.collaborators[0].email).toBe('jane.smith@example.com');
  });

  it('should render a table row for each collaborator', () => {
    const rows = fixture.nativeElement.querySelectorAll('table tr');

    expect(rows.length).toBe(1 + collaborators.length);
    expect(rows[1].textContent).toContain('John Doe');
    expect(rows[2].textContent).toContain('Jane Smith');
  });

  it('should display collaborator names and emails in the table', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('table tr');
    expect(rows[1].textContent).toContain('John Doe');
    expect(rows[1].textContent).toContain('john.doe@example.com');
    expect(rows[2].textContent).toContain('Jane Smith');
    expect(rows[2].textContent).toContain('jane.smith@example.com');
  });

  it('should emit openDetails event when called', () => {
    spyOn(component.openDetails, 'emit');
    const collab = collaborators[0];
    component.openDetails.emit(collab);
    expect(component.openDetails.emit).toHaveBeenCalledWith(collab);
  });

  it('should reset collaborators when filters are toggled off', () => {
    component.collaborators = [];
    component.showFilters = true;

    fixture.detectChanges();
    component.toggleFilters();

    expect(component.showFilters).toBeFalse();
    expect(component.collaborators).toEqual(component.inputCollabs);
  });

  it('should not filter if both name and email are empty', () => {
    component.showFilters = true;
    fixture.detectChanges();

    component.searchForm.setValue({ name: '', email: '' });
    fixture.detectChanges();

    expect(component.collaborators.length).toBe(collaborators.length);
  });

  it('should filter by surname if name matches surname', () => {
    component.showFilters = true;
    fixture.detectChanges();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="name"]');
    nameInput.value = 'Smith';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.collaborators.length).toBe(1);
    expect(component.collaborators[0].surnames).toBe('Smith');
  });


  it('should navigate to holidays page when holidays button is clicked', async () => {
    const holidayButtons = fixture.nativeElement.querySelectorAll('[data-testid="holidays-btn"]');
    const holidayButton = holidayButtons[0];

    holidayButton.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/holidays/0196b4ee-a7fc-750f-a698-6a5dfd27ce71');
  });

  it('should navigate to associations page when projects button is clicked', async () => {
    const projectButtons = fixture.nativeElement.querySelectorAll('[data-testid="projects-btn"]');
    const projectButton = projectButtons[0];

    projectButton.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/associations/0196b4ee-a7fc-750f-a698-6a5dfd27ce71');
  });

});
