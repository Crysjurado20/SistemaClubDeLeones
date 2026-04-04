import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorEspecialidad } from './selector-especialidad';

describe('SelectorEspecialidad', () => {
  let component: SelectorEspecialidad;
  let fixture: ComponentFixture<SelectorEspecialidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorEspecialidad],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectorEspecialidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
