/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HikeProgramStored, LocalizedItem, TextualDescription } from '@features/common/gtrack-interfaces';

import { HikeCardComponent } from '../hike-card.component';

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

describe('HikeCardComponent', () => {
  let component: HikeCardComponent;
  let fixture: ComponentFixture<HikeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HikeCardComponent, DistancePipe, DurationPipe, LocalizeDescriptionPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HikeCardComponent);
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
