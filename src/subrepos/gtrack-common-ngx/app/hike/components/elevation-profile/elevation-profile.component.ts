import { State } from 'app/store';
import { bisector as d3Bisector } from 'd3-array';
import {
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft,
  axisRight as d3AxisRight,
  axisTop as d3AxisTop
} from 'd3-axis';
import { drag as d3Drag } from 'd3-drag';
import { interpolateNumber as d3InterpolateNumber } from 'd3-interpolate';
import { BaseType, event as d3Event, mouse as d3Mouse, select as d3Select, Selection } from 'd3-selection';
import { sliderLeft } from 'd3-simple-slider';
import _cloneDeep from 'lodash-es/cloneDeep';
import _first from 'lodash-es/first';
import _get from 'lodash-es/get';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { HikeProgramStop, PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';
import { DescriptionLanguageListService } from '@bit/garlictech.angular-features.common.multi-language-text';
import { OpenWeatherMapForecastItem } from '@bit/garlictech.angular-features.common.weather';
import { WeatherEntity } from '@bit/garlictech.angular-features.common.weather/store';
import { select, Store } from '@ngrx/store';
import { lineString as turfLineString } from '@turf/helpers';
import lineSliceAlong from '@turf/line-slice-along';

import { AstronomyService } from '../../../astronomy';
import { DistancePipe, UnitsService } from '../../../shared';
import { GeospatialService } from '../../../shared/services/geospatial';
import { ElevationData, ElevationService } from '../../services/elevation';
import { GameRuleService } from '../../services/game-rule';
import { HikeProgram } from '../../services/hike-program';
import { Route, RouteService } from '../../services/route';
import * as poiActions from '../../store/poi/actions';
import { PoiSelectors } from '../../store/poi/selectors';
import * as routeActions from '../../store/route/actions';
import { RouteSelectors } from '../../store/route/selectors';

@Component({
  selector: 'gtrack-common-elevation-profile',
  template: ''
})
export class ElevationProfileComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('elevationProfile') mainDiv: ElementRef;
  @ViewChild('experiment') experiment: ElementRef;
  @Output() readonly elevationLineOver: EventEmitter<void>;
  @Output() readonly elevationLineMove: EventEmitter<GeoJSON.Position>;
  @Output() readonly elevationLineOut: EventEmitter<void>;
  @Output() readonly elevationLineClick: EventEmitter<GeoJSON.Position>;
  @Input() elevationMarkerPosition: GeoJSON.Position;
  @Input() elevationMarkerVisible: boolean;

  @Input() width: number;
  @Input() height: number;
  @Input() startDate: Date;
  @Input() speed: number;

  @Input() weather: WeatherEntity;

  @Input() margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Input() zoom: number;

  route: Route | null;
  activePoi: PoiStored | null;
  activeStop: HikeProgramStop | null;
  marker: Selection<BaseType, {}, null, undefined>;
  elevationText: Selection<BaseType, {}, null, undefined>;

  protected vis: Selection<BaseType, {}, null, undefined>;
  protected _elevationData?: ElevationData;
  protected markerOn: boolean;
  protected distance: DistancePipe;

  protected _displayWidth: number;

  private readonly _destroy$: Subject<boolean>;
  private readonly _hikeProgramChanged$: Subject<boolean>;
  private _hikeProgram?: HikeProgram;

  private readonly _pois$: ReplaySubject<Array<PoiStored>>;

  private _zoomRectangle: Selection<SVGRectElement, {}, null, undefined>;
  private _scrollableGroup: Selection<BaseType, {}, null, undefined>;
  private _scrollPosition: number;

  constructor(
    private readonly _elevationService: ElevationService,
    private readonly _routeService: RouteService,
    private readonly _store: Store<State>,
    private readonly _routeSelectors: RouteSelectors,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _geospatial: GeospatialService,
    private readonly _markerIconsService: MarkerIconsService,
    private readonly _gameRule: GameRuleService,
    private readonly _descriptionLanguageList: DescriptionLanguageListService,
    private readonly _astronomy: AstronomyService,
    unitsService: UnitsService
  ) {
    this.distance = new DistancePipe(unitsService);

    this.elevationLineOver = new EventEmitter<void>();
    this.elevationLineMove = new EventEmitter<GeoJSON.Position>();
    this.elevationLineOut = new EventEmitter<void>();
    this.elevationLineClick = new EventEmitter<GeoJSON.Position>();

    this.width = 570;
    this.height = 220;
    this.startDate = new Date();
    this.speed = 4; // km/h

    this.margins = {
      top: 40,
      right: 20,
      bottom: 20,
      left: 70
    };

    this.zoom = 1;
    this.markerOn = false;
    this._displayWidth = this.width;
    this._destroy$ = new Subject<boolean>();
    this._hikeProgramChanged$ = new Subject<boolean>();
    this._pois$ = new ReplaySubject<Array<PoiStored>>(1);
    this._scrollPosition = 0.5;
  }

  ngOnInit(): void {
    if (typeof this.elevationMarkerPosition !== 'undefined') {
      this.moveHandlerToCoordinate(this.elevationMarkerPosition);
    }

    if (this.elevationMarkerVisible) {
      this.showHandler();
    }

    this._displayWidth = this.width * this.zoom;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.elevationMarkerVisible !== 'undefined') {
      const markerVisible = changes.elevationMarkerVisible;
      this.showHandler(markerVisible.currentValue);
    }

    if (typeof changes.elevationMarkerPosition !== 'undefined') {
      this.moveHandlerToCoordinate(changes.elevationMarkerPosition.currentValue);
    }

    if (this.route && (changes.startDate || changes.speed || changes.weather)) {
      this._removeTimeAxis();
      this._addTimeAxis();
    }

    if (changes.width) {
      this._displayWidth = changes.width.currentValue * this.zoom;
    }
  }

  @Input()
  set hikeProgram(hikeProgram: HikeProgram) {
    if (hikeProgram) {
      this._hikeProgram = hikeProgram;
      this.routeId = hikeProgram.routeId;

      const poiIds = hikeProgram.stops.map(stop => stop.poiId).filter(poiId => !poiId.match(/endpoint/));

      this._hikeProgramChanged$.next(true);

      this._store
        .pipe(
          select(this._poiSelectors.getPoiContextEntities(poiIds)),
          takeUntil(this._destroy$),
          takeUntil(this._hikeProgramChanged$)
        )
        .subscribe(contexts => {
          for (const poiId of poiIds) {
            const context = contexts[poiId];

            if (typeof context === 'undefined' || (!context.loaded && !context.loading)) {
              this._store.dispatch(new poiActions.LoadPoi(poiId));
            }
          }
        });

      this._store
        .pipe(
          select(this._poiSelectors.getPois(poiIds)),
          takeUntil(this._destroy$),
          takeUntil(this._hikeProgramChanged$)
        )
        .subscribe(pois => this._pois$.next(pois));
    } else {
      this.routeId = undefined;
      this._hikeProgram = undefined;
    }
  }

  set routeId(routeId: string | null) {
    if (!routeId) {
      this.route = undefined;
    }

    this._store
      .pipe(
        select(this._routeSelectors.getRouteContext(routeId)),
        takeUntil(this._destroy$)
      )
      .subscribe(context => {
        if (typeof context === 'undefined' || (!context.loaded && !context.loading)) {
          this._store.dispatch(new routeActions.LoadRoute(routeId));
        }
      });

    this._store
      .pipe(
        select(this._routeSelectors.getRoute(routeId)),
        takeUntil(this._destroy$),
        filter(route => typeof route !== 'undefined'),
        map(route => {
          if (route) {
            return new Route(route);
          }
        })
      )
      .subscribe(route => {
        if (!route) {
          throw new Error(`Route ${routeId} is unknown`);
        }

        const firstDraw = typeof this.route === 'undefined';

        if (this._hikeProgram.reversed) {
          const reversed = _cloneDeep(route);
          reversed.path.coordinates.reverse();
          this.route = reversed;
        } else {
          this.route = route;
        }

        if (!this.vis) {
          this.vis = d3Select(this.mainDiv.nativeElement)
            .append('svg')
            .attr('viewBox', `0, 0, ${this._displayWidth}, ${this.height + 60}`);
        }

        if (firstDraw) {
          this._addZoomRectangle();
          this._draw();
          this._addZoomSlider();
          this._addElevationLabel();
        } else {
          this._redraw();
        }
      });
  }

  protected _redraw(): void {
    this.vis.select('#elevation-time-axis').remove();
    this.vis.select('#elevation-line-graph').remove();
    this.vis.select('#elevation-filled-area').remove();
    this.vis.selectAll('.axis-line').remove();
    this.vis.selectAll('.axis-grid').remove();
    this.vis.selectAll('.poi-icon').remove();
    this.vis.selectAll('.poi-line').remove();
    this.vis.selectAll('.elevation-marker').remove();
    this.vis.select('#elevation-zoom-scroll').remove();
    this._draw();
  }

  protected _draw(): any {
    this._elevationData = this._elevationService.getd3ElevationData(
      this.route,
      this._displayWidth,
      this.height,
      this.margins
    );

    if (this._elevationData === null) {
      return undefined;
    }

    this._addFilledArea();
    this._addXAxis();
    this._addYAxis();
    this._addTimeAxis();
    this._addLineGraph();
    this._addPoiIcons();
    this._addZoomScroll();

    this.marker = this._scrollableGroup
      .append('circle')
      .attr('class', 'elevation-marker')
      .attr('r', 4)
      .attr('transform', `translate(0, ${this.margins.top - 20})`)
      .style('fill', '#FFFFFF')
      .style('display', 'none')
      .style('pointer-events', 'none')
      .style('stroke', 'orange')
      // tslint:disable-next-line:no-duplicate-string
      .style('stroke-width', '2px');

    if (this.elevationMarkerPosition) {
      this.moveHandlerToCoordinate(this.elevationMarkerPosition);
    }

    if (this.elevationMarkerVisible) {
      this.showHandler();
    }

    this._scrollableGroup.on('mouseover', () => this.elevationLineOver.emit());

    this._scrollableGroup.on('mouseout', () => this.elevationLineOut.emit());

    this._scrollableGroup.on('mousemove', () => {
      if (!this.markerOn) {
        const mouse = d3Mouse(d3Event.currentTarget);
        const pos = this._eventToPosition(mouse[0]);

        if (pos) {
          this.elevationLineMove.emit(pos);
        }
      }
    });

    this._scrollableGroup.on('click', () => {
      const mouse = d3Mouse(d3Event.currentTarget);
      const pos = this._eventToPosition(mouse[0]);
      this.elevationLineClick.emit(pos);
    });

    this._scrollTo(this._scrollPosition);
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  moveHandlerToCoordinate(position: GeoJSON.Position): void {
    if (typeof this._elevationData !== 'undefined') {
      const lineData = this._elevationData.lineData;
      const xRange = this._elevationData.xRange;
      const yRange = this._elevationData.yRange;
      const coordinates = this.route.path.coordinates;

      const distance = this._geospatial.distanceOnLine(coordinates[0], position, this.route.route.features[0]) / 1000;

      const bisect = _get(d3Bisector((d: [number, number]) => d[0]), 'right');

      const x = distance;

      const index = bisect(lineData, x);
      const startData = lineData[index - 1];
      const endData = lineData[index];

      if (startData && endData) {
        const interpolate = d3InterpolateNumber(startData[1], endData[1]);
        const range = endData[0] - startData[0];
        const valueY = interpolate((x % range) / range);

        if (this.elevationText) {
          this.elevationText.text(this.distance.transform(valueY));
        }

        if (this.marker) {
          this.marker.attr('cx', xRange(distance));
          this.marker.attr('cy', yRange(valueY));
        }
      }
    }
  }

  showHandler(show = true): void {
    if (this.marker) {
      if (show) {
        this.marker.style('display', 'inherit');
      } else {
        this.marker.style('display', 'none');
      }
    }
  }

  getWeather(date: Date): OpenWeatherMapForecastItem {
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

  protected _xToPosition(x: number): GeoJSON.Position {
    const lineData = this._elevationData.lineData;
    const bisect = _get(d3Bisector((d: [number, number]) => d[0]), 'right');

    const index = bisect(lineData, x);

    return this._routeService.getTrackPoint(this.route, index);
  }

  protected _eventToPosition(eventX: number): GeoJSON.Position | null {
    let trackPoint: GeoJSON.Position;

    if (this._elevationData !== null) {
      const xRange = this._elevationData.xRange;

      const x = xRange.invert(eventX);

      trackPoint = this._xToPosition(x);
    }

    return trackPoint;
  }

  private _addElevationLabel(): void {
    this.elevationText = this.vis
      .append('text')
      .attr('class', 'elevation-label')
      .attr('x', 25)
      .attr('y', this.margins.top - 5);
  }

  private _addYAxis(): void {
    // The vertical axis
    const yAxisVertical = d3AxisLeft(this._elevationData.yRange).tickSize(5);

    this.vis
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top - 20})`)
      .call(yAxisVertical);

    // The grid lines
    const lineWidth = this._displayWidth - this.margins.left - this.margins.right;
    const yAxisLines = d3AxisRight(this._elevationData.yRange).tickSize(lineWidth);

    const customYAxis = g => {
      g.call(yAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    };

    this._scrollableGroup
      .append('svg:g')
      .attr('class', 'axis-grid')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top - 20})`)
      .call(customYAxis);
  }

  private _addZoomRectangle(): void {
    this.vis
      .append('defs')
      .append('clipPath')
      .attr('id', 'scroll-clip')
      .append('rect')
      .attr('x', this.margins.left - 10)
      .attr('y', 0)
      .attr('width', this.width - this.margins.left - this.margins.right + 11)
      .attr('height', this.height + 60);

    const scrollableGroupParent = this.vis.append('svg:g').attr('clip-path', 'url(#scroll-clip)');

    this._scrollableGroup = scrollableGroupParent
      .append('svg:g')
      .attr('id', 'scrollable')
      .call(
        d3Drag()
          .on('drag', () => {
            this._scrollableGroup.style('cursor', 'grab');
            this._onScroll(true);
          })
          .on('end', () => this._scrollableGroup.style('cursor', 'auto'))
      );
  }

  private _addZoomSlider(): void {
    const sliderHeight = this.height - this.margins.top - this.margins.bottom - 15;
    const steps = 5; // max 16x

    const slider = sliderLeft()
      .min(0)
      .max(steps - 1)
      .step(1)
      .ticks(steps)
      .tickFormat(d => `${2 ** (steps - 1 - d)}x`)
      .height(sliderHeight)
      .default(steps - 1)
      .on('onchange', val => {
        this.zoom = 2 ** (steps - 1 - val);
        this._displayWidth = this.width * this.zoom;
        this._redraw();
      });

    const customSlider = g => {
      g.call(slider);

      g.selectAll('.axis .tick line').attr('x2', -5);

      g.selectAll('.axis .tick text').attr('x', -7);

      g.selectAll('.slider .parameter-value text').attr('x', -14);
    };

    this.vis
      .append('svg:g')
      .attr('class', 'zoom-slider')
      .attr('transform', `translate(30, ${this.margins.top + 10})`)
      .call(customSlider);
  }

  private _addZoomScroll(): void {
    if (this.zoom > 1) {
      this._zoomRectangle = this.vis
        .append('rect')
        .attr('id', 'elevation-zoom-scroll')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', `translate(${this.margins.left}, ${this.height - this.margins.bottom})`)
        .attr('height', 10)
        .attr('width', (this.width - this.margins.left) / this.zoom)
        .attr('fill', '#0000AA')
        .attr('pointer-events', 'all')
        .attr('cursor', 'pointer')
        .attr('opacity', 0.4)
        .call(d3Drag().on('drag', () => this._onScroll()));
    }
  }

  private _onScroll(negate = false): any {
    let multiplier = 1;

    if (negate) {
      multiplier = -1;
    }

    if (this.zoom === 1) {
      return undefined;
    }

    const currentX = parseInt(this._zoomRectangle.attr('x'), 10);
    const currentWidth = parseInt(this._zoomRectangle.attr('width'), 10);
    const viewportWidth = this.width - this.margins.left;
    let newX = currentX + multiplier * d3Event.dx;

    if (newX < 0) {
      newX = 0;
    }

    if (newX + currentWidth > viewportWidth) {
      newX = viewportWidth - currentWidth;
    }

    const percentage = newX / viewportWidth;
    const transform = this._displayWidth * percentage;
    this._zoomRectangle.attr('x', newX);
    this._scrollableGroup.attr('transform', `translate(${-transform}, 0)`);

    this._scrollPosition = percentage + 1 / (this.zoom * 2);
  }

  private _scrollTo(center: number): void {
    let percentage = center - 1 / (this.zoom * 2);
    const viewportWidth = this.width - this.margins.left;

    if (this.zoom > 1) {
      let x = percentage * viewportWidth;
      const currentWidth = parseInt(this._zoomRectangle.attr('width'), 10);

      if (x < 0) {
        x = 0;
      }

      if (x + currentWidth > viewportWidth) {
        x = viewportWidth - currentWidth;
      }

      percentage = x / viewportWidth;
      const transform = this._displayWidth * percentage;

      this._zoomRectangle.attr('x', x);
      this._scrollableGroup.attr('transform', `translate(${-transform}, 0)`);
    } else {
      this._scrollableGroup.attr('transform', `translate(0, 0)`);
    }
  }

  private _addXAxis(): void {
    // The vertical axis
    const xAxisHorizontal = d3AxisBottom(this._elevationData.xRange)
      .tickSize(5)
      .tickFormat(d => `${d} km`);

    this._scrollableGroup
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
      .call(xAxisHorizontal);

    // The grid lines
    const lineHeight = this.height - this.margins.top - this.margins.bottom;

    const xAxisLines = d3AxisTop(this._elevationData.xRange).tickSize(lineHeight);

    const customXAxis = g => {
      g.call(xAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    };

    this._scrollableGroup
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
      .call(customXAxis);
  }

  private _addTimeAxis(): void {
    // The vertical axis
    const xAxisHorizontal = d3AxisBottom(this._elevationData.xRange)
      .tickSize(0)
      .tickFormat(domainValue => {
        const value = domainValue.valueOf(); // km
        const time = this._getTimeForDistance(value);

        return moment(time).format('HH:mm');
      });

    const group = this._scrollableGroup
      .append('svg:g')
      .attr('id', 'elevation-time-axis')
      .attr('class', 'axis-line axis-line-time')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom + 17})`)
      .call(xAxisHorizontal);

    group
      .selectAll('.tick')
      .append('image')
      .attr('xlink:href', (d: number) => {
        const time = this._getTimeForDistance(d);
        const pos = this._xToPosition(d);

        if (!pos) {
          return '';
        }

        const suntimes = this._astronomy.getSunTimes(pos, time);
        let icon = '/assets/icons/weather/wi-day-sunny.svg';

        if (time.getTime() < suntimes.sunrise.getTime()) {
          icon = '/assets/icons/weather/wi-stars.svg';
        }

        return icon;
      })
      .attr('width', 10)
      .attr('height', 10)
      .attr('transform', 'translate(-5, 10)');

    group
      .selectAll('.tick')
      .append('image')
      .attr('xlink:href', (d: number) => {
        const time = this._getTimeForDistance(d);
        const pos = this._xToPosition(d);

        if (!pos) {
          return '';
        }

        const weather = this.getWeather(time);
        let icon = '';

        if (weather && weather.weather && weather.weather[0]) {
          icon = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
        }

        return icon;
      })
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', 'translate(-10, 20)');
  }

  private _removeTimeAxis(): void {
    this.vis.select('#elevation-time-axis').remove();
  }

  private _getTimeForDistance(distance: number): Date {
    let time = 0;

    if (distance > 0) {
      const route = turfLineString(this.route.geojson.features[0].geometry.coordinates);
      const line = lineSliceAlong(route, 0, distance);
      const uphill = this._elevationService.calculateUphill(line.geometry.coordinates);

      time = this._gameRule.segmentTime(distance * 1000, uphill, this.speed);
    }

    const arrive = new Date(this.startDate.getTime());

    arrive.setMinutes(arrive.getMinutes() + time);

    return arrive;
  }

  private _addLineGraph(): void {
    const line = this._elevationData.lineFunc(this._elevationData.lineData);

    if (line !== null) {
      this._scrollableGroup
        .append('svg:path')
        .attr('d', line)
        .attr('id', 'elevation-line-graph')
        .attr('stroke', 'black')
        // tslint:disable-next-line:no-duplicate-string
        .attr('stroke-width', 1)
        .attr('transform', `translate(0, ${this.margins.top - 20})`)
        .attr('fill', 'none');
    }
  }

  private _addFilledArea(): void {
    const areaGradient = this.vis
      .append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#21825C')
      .attr('stop-opacity', 0.6);
    areaGradient
      .append('stop')
      .attr('offset', '80%')
      .attr('stop-color', 'white')
      .attr('stop-opacity', 0);

    const area = this._elevationData.areaFunc(this._elevationData.lineData);

    this._scrollableGroup
      .append('svg:path')
      .attr('id', 'elevation-filled-area')
      .attr('d', area)
      .attr('transform', `translate(0, ${this.margins.top - 20})`)
      .attr('fill', 'url(#areaGradient)');
  }

  private _addPoiIcons(): void {
    this._pois$.pipe(takeUntil(this._destroy$)).subscribe(pois => {
      this.vis.selectAll('image.poi-icon').remove();
      this.vis.selectAll('.poi-line').remove();

      for (const poi of pois) {
        const coordinates = this.route.path.coordinates;
        const xRange = this._elevationData.xRange;

        const stop = this._hikeProgram.stops.find(hikeStop => hikeStop.poiId === poi.id);

        const distance =
          this._geospatial.distanceOnLine(coordinates[0], [poi.lon, poi.lat], this.route.route.features[0]) / 1000;
        const type = _get(poi, 'types[0]', 'unknown');

        const poiImage = this._scrollableGroup
          .append('svg:image')
          .attr('class', 'poi-icon')
          .attr('x', xRange(distance) - 10)
          .attr('y', this.margins.top - 24)
          .attr('width', 21)
          .attr('height', 24)
          .attr('href', this._markerIconsService.getIcon(type, true))
          .style('cursor', 'pointer')
          .on('click', () => {
            this.activePoi = poi;
            this.activeStop = stop;
          });

        this._descriptionLanguageList
          .getLocalizedDescription(poi.description)
          .pipe(take(1))
          .subscribe(description => {
            poiImage.append('svg:title').text(description.title);
          });

        this._scrollableGroup
          .append('svg:line')
          .attr('class', 'poi-line')
          .style('stroke', 'black')
          // tslint:disable-next-line:no-duplicate-string
          .style('stroke-width', '0.5px')
          .attr('x1', xRange(distance))
          .attr('x2', xRange(distance))
          .attr('y1', this.margins.top)
          .attr('y2', this.height - this.margins.bottom);
      }
    });
  }
}
