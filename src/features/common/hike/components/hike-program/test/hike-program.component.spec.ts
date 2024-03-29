import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AstronomyService } from '@bit/garlictech.angular-features.common.astronomy';
import { GameRuleService } from '@bit/garlictech.angular-features.common.game-rule/services';
import {
  HikeProgramStored,
  LocalizedItem,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { LeafletIconService } from '@bit/garlictech.angular-features.common.leaflet-map/services';
import { poiReducer, PoiSelectors } from '@bit/garlictech.angular-features.common.poi';
import { StoreModule } from '@ngrx/store';

import { HikeProgramComponent } from '../hike-program.component';

@Pipe({
  name: 'distance'
})
class DistancePipe implements PipeTransform {
  transform(value: number): string {
    return value.toString();
  }
}

@Pipe({
  name: 'localizeDescription'
})
class LocalizeDescriptionPipe implements PipeTransform {
  transform(value: LocalizedItem<TextualDescription>): TextualDescription {
    return {
      title: '',
      fullDescription: '',
      summary: ''
    };
  }
}

describe('HikeProgramComponent', () => {
  let component: HikeProgramComponent;
  let fixture: ComponentFixture<HikeProgramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [PoiSelectors, LeafletIconService, GameRuleService, AstronomyService],
      imports: [
        StoreModule.forRoot({
          poi: poiReducer
        })
      ],
      declarations: [HikeProgramComponent, DistancePipe, LocalizeDescriptionPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeProgramComponent);
    component = fixture.componentInstance;

    component.hikeProgram = <HikeProgramStored>{
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
