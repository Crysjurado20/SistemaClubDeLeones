import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCustom } from './calendar-custom';

describe('CalendarCustom', () => {
  let component: CalendarCustom;
  let fixture: ComponentFixture<CalendarCustom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCustom],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarCustom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
