import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPatients } from './crud-patients';

describe('CrudPatients', () => {
  let component: CrudPatients;
  let fixture: ComponentFixture<CrudPatients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPatients],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudPatients);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
