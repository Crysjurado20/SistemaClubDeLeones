import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsCrud } from './doctors-crud';

describe('DoctorsCrud', () => {
  let component: DoctorsCrud;
  let fixture: ComponentFixture<DoctorsCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorsCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
