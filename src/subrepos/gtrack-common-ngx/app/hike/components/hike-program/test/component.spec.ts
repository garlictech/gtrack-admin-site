/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { IHike } from '../../../services/hike';

import { HikeProgramComponent } from '../';


@Pipe({
  name: 'distance'
})
class DistancePipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

describe('HikeProgramComponent', () => {
  let component: HikeProgramComponent;
  let fixture: ComponentFixture<HikeProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HikeProgramComponent, DistancePipe ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeProgramComponent);
    component = fixture.componentInstance;

    component.hike = <IHike>{
      id: '1',
      distance: 4500,
      uphill: 2345,
      downhill: 3456,
      time: 120,
      score: 500,
      difficulty: 'hard',
      routeIcon: '',
      elevationIcon: '',
      routeId: '',
      description: {},
      location: 'Budapest',
      program: {
        pois: [
          {
            distance: 10,
            name: 'test',
            segment: {
              distance: 50
            }
          }
        ]
      }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
