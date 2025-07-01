import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationRessourcePageComponent } from './creation-ressource-page.component';

describe('CreationRessourcePageComponent', () => {
  let component: CreationRessourcePageComponent;
  let fixture: ComponentFixture<CreationRessourcePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationRessourcePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationRessourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

