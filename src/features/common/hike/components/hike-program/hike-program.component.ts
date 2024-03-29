import _first from 'lodash-es/first';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import { Observable, of as observableOf } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AstronomyService } from '@bit/garlictech.angular-features.common.astronomy';
import { GameRuleService } from '@bit/garlictech.angular-features.common.game-rule/services';
import { HikeProgramData, HikeProgramStop, PoiData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';
import { PoiSelectors } from '@bit/garlictech.angular-features.common.poi/store';
import * as poiActions from '@bit/garlictech.angular-features.common.poi/store/actions';
import { WeatherEntity } from '@bit/garlictech.angular-features.common.weather/store';
import { Dictionary } from '@ngrx/entity/src/models';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'gtrack-common-hike-program',
  template: ''
})
export class HikeProgramComponent implements OnInit, OnChanges {
  @Input() hikeProgram: HikeProgramData;

  @Input() weather: WeatherEntity;

  stops: Array<HikeProgramStop>;

  pois$: Observable<Partial<Dictionary<PoiData>>>;
  startIcon: string;
  finishIcon: string;
  activeStop: HikeProgramStop;

  startTime: {
    hours: number;
    minutes: number;
  };

  @Input() startDate: Date;

  @Input() speed;

  timeline: Array<{
    time: Date;
    events: Array<{
      icon: string;
      title: string;
    }>;
  }>;

  constructor(
    private readonly _poiSelectors: PoiSelectors,
    private readonly _store: Store<any>,
    private readonly _gameRule: GameRuleService,
    private readonly _astronomy: AstronomyService,
    private readonly _markerIconsService: MarkerIconsService
  ) {
    this.startIcon = this._markerIconsService.getIcon('start', true);
    this.finishIcon = this._markerIconsService.getIcon('finish', true);
    this.speed = 4;
    this.startTime = {
      hours: 5,
      minutes: 0
    };
  }

  displayStop(stop): void {
    if (stop.eventOnly !== true) {
      this.activeStop = stop;
    }
  }

  // TODO: Move this to a service
  getWeather(date: Date): any {
    const time = date.getTime();

    if (!this.weather) {
      return undefined;
    }

    // Find the closest item
    return this.weather.list.reduce((prev, current) => {
      const diff1 = Math.abs(time - current.dt * 1000);
      const diff2 = Math.abs(time - prev.dt * 1000);

      return diff1 < diff2 ? current : prev;
    });
  }

  generateTimeline(): any {
    if (!this.startDate) {
      return undefined;
    }

    const times = this.hikeProgram.stops.map((stop, i) => this.getSegmentStartTime(i));

    const startPosition: GeoJSON.Position = [this.hikeProgram.stops[0].lon, this.hikeProgram.stops[0].lat];

    const sunrise = this._astronomy.getSunTimes(startPosition, this.startDate);
    const events = 'dawn sunrise sunset dusk'.split(' ');

    const icons = {
      dawn: '/assets/icons/weather/wi-horizon-alt.svg',
      sunrise: '/assets/icons/weather/wi-sunrise.svg',
      sunset: '/assets/icons/weather/wi-sunset.svg',
      dusk: '/assets/icons/weather/wi-horizon.svg'
    };

    const positions = events.map(event =>
      times.findIndex((time, i) => {
        const nextTime = times[i];

        return typeof nextTime !== 'undefined' && nextTime.getTime() >= sunrise[event].getTime();
      })
    );

    this.stops = this.hikeProgram.stops.reduce((array, stop, i: number) => {
      const eventIndexes = positions
        .map((position, index) => {
          if (position === i) {
            return index;
          } else {
            return -1;
          }
        })
        .filter(index => index !== -1);

      const time = this.getSegmentStartTime(i);
      const weather = this.getWeather(time);

      let stopEvents = [
        {
          icon: 'assets/icons/weather/wi-day-sunny.svg',
          title: 'astronomy.day'
        }
      ];

      if (time.getTime() < sunrise.sunrise.getTime()) {
        stopEvents = [
          {
            icon: 'assets/icons/weather/wi-stars.svg',
            title: 'astronomy.night'
          }
        ];
      }

      const stopWithEvents = {
        ...stop,
        arrive: time,
        events: stopEvents,
        weather: []
      };

      if (weather && weather.weather) {
        stopWithEvents.weather = weather.weather;
      }

      let fakeStops = [];

      if (i > 0) {
        fakeStops = eventIndexes.map(eventIndex => {
          const event = events[eventIndex];
          const next = this.hikeProgram.stops[i + 1] || {
            segment: {}
          };

          const sunriseWeather = this.getWeather(sunrise[event]);

          const fakeStop = {
            eventOnly: true,
            arrive: sunrise[event],
            title: `astronomy.${event}`,
            segment: next.segment,
            eventIcon: icons[event],
            weather: []
          };

          if (sunriseWeather && sunriseWeather.weather) {
            fakeStop.weather = sunriseWeather.weather;
          }

          return fakeStop;
        });
      }

      return [...array, ...fakeStops, stopWithEvents];
    }, []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hikeProgram) {
      const change = changes.hikeProgram;

      if (!change.firstChange) {
        this.stops = [...change.currentValue.stops];
        this.generateTimeline();
      }
    }

    if (changes.startDate || changes.speed || changes.weather) {
      this.generateTimeline();
    }
  }

  ngOnInit(): void {
    const hikePois = this.hikeProgram.stops.filter(stop => !/^endpoint/.test(stop.poiId)).map(stop => stop.poiId);

    if (hikePois.length > 0) {
      this.pois$ = this._store.pipe(
        select(this._poiSelectors.getPoiEntities(hikePois)),
        filter(pois => !_isEmpty(pois))
      );
    } else {
      this.pois$ = observableOf({});
    }

    this._store
      .pipe(
        select(this._poiSelectors.getPoiContextEntities(hikePois)),
        take(1)
      )
      .subscribe(contexts => {
        const notLoaded = hikePois
          .filter(id => !/^endpoint/.test(id))
          .filter(id => {
            const context = contexts[id];
            const loaded = _get(context, 'loaded', false);
            const loading = _get(context, 'loading', false);

            return !loaded && !loading;
          });

        if (notLoaded.length > 0) {
          this._store.dispatch(new poiActions.LoadPois(notLoaded));
        }
      });

    this.stops = [...this.hikeProgram.stops];
    this.generateTimeline();
  }

  getSegmentStartTime(segmentIndex: number): Date {
    const time: number = this.hikeProgram.stops
      .filter((stop, i) => i < segmentIndex)
      .map(stop => stop.segment)
      .reduce(
        (previous: number, segment) =>
          previous + this._gameRule.segmentTime(segment.distance, segment.uphill, this.speed),
        0
      );

    const arrive = new Date(this.startDate.getTime());

    arrive.setMinutes(arrive.getMinutes() + time);

    return arrive;
  }
}
