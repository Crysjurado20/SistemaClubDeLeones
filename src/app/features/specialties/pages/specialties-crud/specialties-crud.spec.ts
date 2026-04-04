import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialtiesCrud } from './specialties-crud';

describe('SpecialtiesCrud', () => {
  let component: SpecialtiesCrud;
  let fixture: ComponentFixture<SpecialtiesCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialtiesCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtiesCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
