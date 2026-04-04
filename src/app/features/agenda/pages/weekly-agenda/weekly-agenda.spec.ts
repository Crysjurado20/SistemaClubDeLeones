import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAgenda } from './weekly-agenda';

describe('WeeklyAgenda', () => {
  let component: WeeklyAgenda;
  let fixture: ComponentFixture<WeeklyAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyAgenda],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyAgenda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
