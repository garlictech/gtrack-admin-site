import { of as observableOf, Observable } from 'rxjs';

import { filter, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Dictionary } from '@ngrx/entity/src/models';

import _get from 'lodash-es/get';

import { GameRuleService } from '../../services/game-rule';
import { AstronomyService } from '../../../astronomy';

import _isEmpty from 'lodash-es/isEmpty';

import { IPoi, IHikeProgram, IHikeProgramStop } from '../../../../../provider-client';
import { PoiSelectors } from '../../store/poi';
import * as poiActions from '../../store/poi/actions';
import { IconService } from '../../../map/services/icon';
import { IWeatherEntity } from '@common.features/weather/store';

@Component({
  selector: 'gtrack-common-hike-program',
  template: ''
})
export class HikeProgramComponent implements OnInit, OnChanges {
  @Input()
  public hikeProgram: IHikeProgram;

  @Input()
  public weather: IWeatherEntity;

  public stops: IHikeProgramStop[];

  public pois$: Observable<Partial<Dictionary<IPoi>>>;
  public startIcon: string;
  public finishIcon: string;
  public activeStop: IHikeProgramStop;

  public startTime = {
    hours: 5,
    minutes: 0
  };

  @Input()
  public startDate: Date;

  @Input()
  public speed = 4;

  public timeline: {
    time: Date;
    events: {
      icon: string;
      title: string;
    }[];
  }[];

  constructor(
    private _poiSelectors: PoiSelectors,
    private _store: Store<any>,
    private _gameRule: GameRuleService,
    private _astronomy: AstronomyService,
    public icon: IconService
  ) {
    this.startIcon = icon.url('start');
    this.finishIcon = icon.url('finish');
  }

  public displayStop(stop) {
    if (stop.eventOnly !== true) {
      this.activeStop = stop;
    }
  }

  public getWeather(date: Date) {
    const time = date.getTime();

    if (!this.weather) {
      return;
    }

    return this.weather.list.find((item, i) => {
      const wtime = item.dt * 1000;
      const next = wtime + 3 * 60 * 60 * 1000; // 3 hours
      if (wtime <= time && time <= next) {
        return true;
      }

      return false;
    });
  }

  public generateTimeline() {
    if (!this.startDate) {
      return;
    }

    const times = this.hikeProgram.stops.map((stop, i) => this.getSegmentStartTime(i));

    const startPosition: GeoJSON.Position = [this.hikeProgram.stops[0].lon, this.hikeProgram.stops[0].lat];

    const sunrise = this._astronomy.getSunTimes(startPosition, this.startDate);
    const events = 'dawn sunrise sunset dusk'.split(' ');

    const icons = {
      dawn: 'assets/icons/weather/wi-horizon-alt.svg',
      sunrise: 'assets/icons/weather/wi-sunrise.svg',
      sunset: 'assets/icons/weather/wi-sunset.svg',
      dusk: 'assets/icons/weather/wi-horizon.svg'
    };

    const positions = events.map(event => {
      return times.findIndex((time, i) => {
        const nextTime = times[i];

        return typeof nextTime !== 'undefined' && nextTime.getTime() >= sunrise[event].getTime();
      });
    });

    this.stops = this.hikeProgram.stops.reduce((array, stop, i) => {
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hikeProgram) {
      const change = changes.hikeProgram;

      if (change.firstChange !== true) {
        this.stops = [...this.hikeProgram.stops];
        this.generateTimeline();
      }
    }

    if (changes.startDate || changes.speed || changes.weather) {
      this.generateTimeline();
    }
  }

  ngOnInit() {
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

  public getSegmentStartTime(segmentIndex: number) {
    const time = this.hikeProgram.stops
      .filter((stop, i) => i < segmentIndex)
      .map(stop => stop.segment)
      .reduce(
        (previous, segment) => previous + this._gameRule.segmentTime(segment.distance, segment.uphill, this.speed),
        0
      );

    const arrive = new Date(this.startDate.getTime());

    arrive.setMinutes(arrive.getMinutes() + time);

    return arrive;
  }
}
