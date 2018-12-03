import { async, TestBed, ComponentFixture } from '@angular/core/testing';

import { WeatherIconComponent } from '../weather-icon.component';

describe('WeatherIconComponent', () => {
  let component: WeatherIconComponent;
  let fixture: ComponentFixture<WeatherIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WeatherIconComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherIconComponent);
    component = fixture.componentInstance;
    component.icon = 'test';

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toEqual('http://openweathermap.org/img/w/test.png');
  });
});
