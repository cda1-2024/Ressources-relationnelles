import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRessourcesComponent } from './my-ressources.component';

describe('MyRessourcesComponent', () => {
  let component: MyRessourcesComponent;
  let fixture: ComponentFixture<MyRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRessourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
