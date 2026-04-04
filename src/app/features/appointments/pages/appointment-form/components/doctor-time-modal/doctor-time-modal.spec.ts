import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorTimeModal } from './doctor-time-modal';

describe('DoctorTimeModal', () => {
  let component: DoctorTimeModal;
  let fixture: ComponentFixture<DoctorTimeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorTimeModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorTimeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
