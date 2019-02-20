
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';

import { HikeProgramStored } from '@features/common/gtrack-interfaces';

import { HikeInfoComponent } from '../';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

describe('HikeInfoComponent', () => {
  let component: HikeInfoComponent;
  let fixture: ComponentFixture<HikeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HikeInfoComponent, DistancePipe, DurationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeInfoComponent);
    component = fixture.componentInstance;

    component.hikeProgram = <HikeProgramStored>{
      id: '1',
      distance: 4500,
      uphill: 2345,
      downhill: 3456,
      time: 120,
      score: 500,
      location: 'Budapest'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
