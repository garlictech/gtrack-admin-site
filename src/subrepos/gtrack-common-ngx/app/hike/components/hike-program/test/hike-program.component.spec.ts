/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Pipe, PipeTransform } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { IHikeProgramStored } from 'subrepos/provider-client';
import { PoiSelectors, poiReducer } from '../../../store/poi';
import { EXTERNAL_POI_DEPENDENCIES } from '../../../externals';
import { IconService } from '../../../../map/services/icon';

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
      providers: [
        PoiSelectors,
        {
          provide: EXTERNAL_POI_DEPENDENCIES,
          useValue: {
            storeDomain: 'poi'
          }
        },
        IconService
      ],
      imports: [
        StoreModule.forRoot({
          poi: poiReducer
        })
      ],
      declarations: [HikeProgramComponent, DistancePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeProgramComponent);
    component = fixture.componentInstance;

    component.hikeProgram = <IHikeProgramStored>{
      id: '1',
      distance: 4500,
      uphill: 2345,
      downhill: 3456,
      time: 120,
      score: 500,
      isRoundTrip: false,
      difficulty: 5,
      routeIcon: '',
      elevationIcon: '',
      routeId: '',
      description: {},
      location: 'Budapest',
      stops: [
        {
          distanceFromOrigo: 10,
          segment: {
            distance: 50
          }
        }
      ]
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
