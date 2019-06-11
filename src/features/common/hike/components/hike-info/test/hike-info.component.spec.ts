/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { DistancePipe, DurationPipe } from '@bit/garlictech.angular-features.common.utils/pipes';
import { HikeInfoComponent } from '../hike-info.component';

describe('HikeInfoComponent', () => {
  let component: HikeInfoComponent;
  let fixture: ComponentFixture<HikeInfoComponent>;

  beforeEach(async(() => {
    // tslint:disable-next-line: no-floating-promises
    TestBed.configureTestingModule({
      declarations: [HikeInfoComponent, DistancePipe, DurationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeInfoComponent);
    component = fixture.componentInstance;

    // tslint:disable-next-line: no-object-literal-type-assertion
    component.hikeProgram = {
      id: '1',
      distance: 4500,
      uphill: 2345,
      downhill: 3456,
      time: 120,
      score: 500,
      location: 'Budapest'
    } as HikeProgramStored;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
