import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorApuestasComponent } from './gestor-apuestas.component';

describe('GestorApuestasComponent', () => {
  let component: GestorApuestasComponent;
  let fixture: ComponentFixture<GestorApuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestorApuestasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestorApuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
