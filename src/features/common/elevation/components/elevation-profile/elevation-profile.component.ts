import { bisector as d3Bisector } from 'd3-array';
import { axisBottom as d3AxisBottom } from 'd3-axis';
import { drag as d3Drag } from 'd3-drag';
import { interpolateNumber as d3InterpolateNumber } from 'd3-interpolate';
import { BaseType, event as d3Event, mouse as d3Mouse, select as d3Select, Selection } from 'd3-selection';
import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import * as moment from 'moment';
import { Subject } from 'rxjs';

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { AstronomyService } from '@bit/garlictech.angular-features.common.astronomy';
import { GameRuleService } from '@bit/garlictech.angular-features.common.game-rule';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import { HikeProgramStop, PoiStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { HikeProgram } from '@bit/garlictech.angular-features.common.hike';

import { Poi } from '@bit/garlictech.angular-features.common.poi';

import { Route } from '@bit/garlictech.angular-features.common.route/lib';
import { RouteService } from '@bit/garlictech.angular-features.common.route/services';

import { UnitsService } from '@bit/garlictech.angular-features.common.units';
import { DistancePipe } from '@bit/garlictech.angular-features.common.utils/pipes';
import { OpenWeatherMapForecastItem } from '@bit/garlictech.angular-features.common.weather';
import { WeatherEntity } from '@bit/garlictech.angular-features.common.weather/store';

import { lineString as turfLineString } from '@turf/helpers';
import lineSliceAlong from '@turf/line-slice-along';

import { ElevationData, ElevationService } from '../../services/elevation/elevation.service';

@Component({
  selector: 'gtrack-common-elevation-profile',
  template: ''
})
export class ElevationProfileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() hikeProgram: HikeProgram;
  @Input() route: Route;
  @Input() pois: Array<Poi>;

  @ViewChild('elevationProfile') mainDiv: ElementRef;
  @ViewChild('svg') svgRef: ElementRef;
  @ViewChild('experiment') experiment: ElementRef;
  @Output() readonly elevationLineOver: EventEmitter<void>;
  @Output() readonly elevationLineMove: EventEmitter<GeoJSON.Position>;
  @Output() readonly elevationLineOut: EventEmitter<void>;
  @Output() readonly elevationLineClick: EventEmitter<GeoJSON.Position>;
  @Input() elevationMarkerPosition: GeoJSON.Position;
  @Input() elevationMarkerVisible: boolean;

  width: number;
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

  activePoi: PoiStored | null;
  activeStop: HikeProgramStop | null;
  marker: Selection<BaseType, {}, null, undefined>;
  elevationText: string;
  elevationData?: ElevationData;
  displayWidth: number;
  xAxisLineHeight: number;
  yAxisLineWidth: number;

  protected vis: Selection<BaseType, {}, null, undefined>;
  protected markerOn: boolean;
  protected distance: DistancePipe;

  private readonly _destroy$: Subject<boolean>;

  private _zoomRectangle: Selection<SVGRectElement, {}, null, undefined>;
  private _scrollableGroup: Selection<BaseType, {}, null, undefined>;
  private _scrollPosition: number;

  @HostListener('window:resize') onResize(): void {
    const width = this.mainDiv.nativeElement.clientWidth;

    this.width = width;
    this.displayWidth = width;

    this.elevationData = this._elevationService.getd3ElevationData(
      this.route,
      this.displayWidth,
      this.height,
      this.margins
    );

    this.yAxisLineWidth = this.displayWidth - this.margins.left - this.margins.right;
  }

  constructor(
    private readonly _elevationService: ElevationService,
    private readonly _routeService: RouteService,
    private readonly _geospatial: GeospatialService,
    private readonly _gameRule: GameRuleService,
    private readonly _astronomy: AstronomyService,
    unitsService: UnitsService
  ) {
    this.distance = new DistancePipe(unitsService);
    this.elevationText = '';

    this.elevationLineOver = new EventEmitter<void>();
    this.elevationLineMove = new EventEmitter<GeoJSON.Position>();
    this.elevationLineOut = new EventEmitter<void>();
    this.elevationLineClick = new EventEmitter<GeoJSON.Position>();
    this.height = 300;
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
    this._destroy$ = new Subject<boolean>();
    this._scrollPosition = 0.5;
  }

  ngOnInit(): void {
    this.width = this.mainDiv.nativeElement.clientWidth;
    this.displayWidth = this.width;

    if (typeof this.elevationMarkerPosition !== 'undefined') {
      this.moveHandlerToCoordinate(this.elevationMarkerPosition);
    }

    if (this.elevationMarkerVisible) {
      this.showHandler();
    }

    this.displayWidth = this.width * this.zoom;
    this.xAxisLineHeight = this.height - this.margins.top - this.margins.bottom;
    this.yAxisLineWidth = this.displayWidth - this.margins.left - this.margins.right;

    if (!this.vis) {
      this.vis = d3Select(this.svgRef.nativeElement);
    }
    this._addZoomRectangle();
    this._draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof changes.elevationMarkerVisible !== 'undefined' && !changes.elevationMarkerVisible.firstChange) {
      const markerVisible = changes.elevationMarkerVisible;
      this.showHandler(markerVisible.currentValue);
    }

    if (typeof changes.elevationMarkerPosition !== 'undefined' && !changes.elevationMarkerPosition.firstChange) {
      this.moveHandlerToCoordinate(changes.elevationMarkerPosition.currentValue);
    }

    if (this.route && this.vis && (changes.startDate || changes.speed || changes.weather)) {
      this._removeTimeAxis();
      this._addTimeAxis();
    }

    if (changes.width && !changes.width.firstChange) {
      this.displayWidth = changes.width.currentValue * this.zoom;
    }
  }

  protected _redraw(): void {
    this.yAxisLineWidth = this.displayWidth - this.margins.left - this.margins.right;
    this.vis.select('#elevation-time-axis').remove();
    this.vis.selectAll('.elevation-marker').remove();
    this.vis.select('#elevation-zoom-scroll').remove();
    this._draw();
  }

  protected _draw(): any {
    this.elevationData = this._elevationService.getd3ElevationData(
      this.route,
      this.displayWidth,
      this.height,
      this.margins
    );

    if (this.elevationData === null) {
      return undefined;
    }

    // this._addFilledArea();
    // this._addXAxis();
    // this._addYAxis();
    this._addTimeAxis();
    this._addZoomScroll();

    this.marker = this._scrollableGroup
      .append('circle')
      .attr('class', 'elevation-marker')
      .attr('r', 10)
      .attr('transform', `translate(0, ${this.margins.top - 22})`)
      .style('fill', '#FFFFFF')
      .style('display', 'none')
      .style('pointer-events', 'none')
      .style('stroke', 'orange')
      // tslint:disable-next-line:no-duplicate-string
      .style('stroke-width', '4px');

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
    if (typeof this.elevationData !== 'undefined') {
      const lineData = this.elevationData.lineData;
      const xRange = this.elevationData.xRange;
      const yRange = this.elevationData.yRange;
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

        this.elevationText = this.distance.transform(valueY);

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

  onZoomChange(zoom: number): void {
    this.zoom = zoom;
    this.displayWidth = this.width * this.zoom;
    this._redraw();
  }

  protected _xToPosition(x: number): GeoJSON.Position {
    const lineData = this.elevationData.lineData;
    const bisect = _get(d3Bisector((d: [number, number]) => d[0]), 'right');

    const index = bisect(lineData, x);

    return this._routeService.getTrackPoint(this.route, index);
  }

  protected _eventToPosition(eventX: number): GeoJSON.Position | null {
    let trackPoint: GeoJSON.Position;

    if (this.elevationData !== null) {
      const xRange = this.elevationData.xRange;

      const x = xRange.invert(eventX);

      trackPoint = this._xToPosition(x);
    }

    return trackPoint;
  }

  private _addZoomRectangle(): void {
    this._scrollableGroup = this.vis.select('#scrollable').call(
      d3Drag()
        .on('drag', () => {
          this._scrollableGroup.style('cursor', 'grab');
          this._onScroll(true);
        })
        .on('end', () => this._scrollableGroup.style('cursor', 'auto'))
    );
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
    const transform = this.displayWidth * percentage;
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
      const transform = this.displayWidth * percentage;

      this._zoomRectangle.attr('x', x);
      this._scrollableGroup.attr('transform', `translate(${-transform}, 0)`);
    } else {
      this._scrollableGroup.attr('transform', `translate(0, 0)`);
    }
  }

  private _addTimeAxis(): void {
    // The vertical axis
    const xAxisHorizontal = d3AxisBottom(this.elevationData.xRange)
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
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', 'translate(-10, 20)');

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
      .attr('width', 40)
      .attr('height', 40)
      .attr('transform', 'translate(-20, 40)');
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
}
