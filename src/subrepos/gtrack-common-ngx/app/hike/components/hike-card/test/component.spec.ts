/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { IHike } from '../../../services/hike';

import { HikeCardComponent } from '../';

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

describe('HikeCardComponent', () => {
  let component: HikeCardComponent;
  let fixture: ComponentFixture<HikeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikeCardComponent, DistancePipe, DurationPipe ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeCardComponent);
    component = fixture.componentInstance;
    component.hike = <IHike>{
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
