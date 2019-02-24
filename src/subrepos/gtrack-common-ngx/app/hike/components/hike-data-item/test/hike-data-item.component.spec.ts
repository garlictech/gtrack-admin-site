
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HikeProgramStored } from '@features/common/gtrack-interfaces';
import { HikeDataItemComponent } from '../';

@Pipe({
  name: 'distance'
})
class DistancePipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

@Pipe({
  name: 'duration'
})
class DurationPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

describe('HikeDataItemComponent', () => {
  let component: HikeDataItemComponent;
  let fixture: ComponentFixture<HikeDataItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HikeDataItemComponent, DistancePipe, DurationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeDataItemComponent);
    component = fixture.componentInstance;

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
