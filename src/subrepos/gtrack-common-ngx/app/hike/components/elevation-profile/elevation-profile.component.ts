import { map, filter, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';

import { State } from 'app/store';
import { Subject } from 'rxjs';

import {
  select as d3Select,
  mouse as d3Mouse,
  event as d3Event,
  Selection,
  BaseType
} from 'd3-selection';

import {
  bisector as d3Bisector
} from 'd3-array';

import {
  axisLeft as d3AxisLeft,
  axisRight as d3AxisRight,
  axisTop as d3AxisTop,
  axisBottom as d3AxisBottom
} from 'd3-axis';

import {
  interpolateNumber as d3InterpolateNumber
} from 'd3-interpolate';

import { DistancePipe, UnitsService } from '../../../shared';
import { IElevationData, ElevationService } from '../../services/elevation';
import { Route, RouteService } from '../../services/route';
import { RouteSelectors } from '../../store/route/selectors';
import * as routeActions from '../../store/route/actions';
import { HikeProgram } from '../../services/hike-program';
import { GeospatialService } from '../../../shared/services/geospatial';

@Component({
  selector: 'gtrack-common-elevation-profile',
  template: ''
})
export class ElevationProfileComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('elevationProfile')
  public mainDiv: ElementRef;

  @ViewChild('experiment')
  public experiment: ElementRef;

  @Output()
  public elevationLineOver = new EventEmitter<void>();

  @Output()
  public elevationLineMove = new EventEmitter<GeoJSON.Position>();

  @Output()
  public elevationLineOut = new EventEmitter<void>();

  @Output()
  public elevationLineClick = new EventEmitter<GeoJSON.Position>();

  @Input()
  public elevationMarkerPosition: GeoJSON.Position;

  @Input()
  public elevationMarkerVisible: boolean;

  @Input()
  public width = 450;

  @Input()
  public height = 200;

  @Input()
  public margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  };

  public route: Route | null;
  public marker: Selection<BaseType, {}, null, undefined>;
  public elevationText: Selection<BaseType, {}, null, undefined>;

  protected vis: Selection<BaseType, {}, null, undefined>;
  protected _elevationData: IElevationData | null = null;
  protected markerOn = false;
  protected distance: DistancePipe;

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _elevationService: ElevationService,
    private _routeService: RouteService,
    private _store: Store<State>,
    private _routeSelectors: RouteSelectors,
    private _geospatial: GeospatialService,
    unitsService: UnitsService
  ) {
    this.distance = new DistancePipe(unitsService);
  }

  ngOnInit() {
    if (typeof this.elevationMarkerPosition !== 'undefined') {
      this.moveHandlerToCoordinate(this.elevationMarkerPosition);
    }

    if (this.elevationMarkerVisible === true) {
      this.showHandler();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes.elevationMarkerVisible !== 'undefined') {
      const markerVisible = changes.elevationMarkerVisible;
      this.showHandler(markerVisible.currentValue);
    }

    if (typeof changes.elevationMarkerPosition !== 'undefined') {
      this.moveHandlerToCoordinate(changes.elevationMarkerPosition.currentValue);
    }
  }

  @Input()
  public set hikeProgram(hikeProgram: HikeProgram) {
    if (hikeProgram) {
      this.routeId = hikeProgram.routeId;
    } else {
      this.routeId = null;
    }
  }

  public set routeId(routeId: string | null) {
    if (!routeId) {
      this.route = null;
      return;
    }

    this._store
      .pipe(
        select(this._routeSelectors.getRouteContext(routeId)),
        takeUntil(this._destroy$)
      )
      .subscribe(context => {
        if (typeof context === 'undefined' || (context.loaded !== true && context.loading !== true)) {
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

        this.route = route;

        if (!this.vis) {
          this.vis = d3Select(this.mainDiv.nativeElement)
            .append('svg')
            .attr('viewBox', `0, 0, ${this.width}, ${this.height}`);
        }

        this._elevationData = this._elevationService.getd3ElevationData(route, this.width, this.height, this.margins);

        if (this._elevationData === null) {
          return;
        }

        this._addFilledArea();
        this._addXAxis();
        this._addYAxis();
        this._addLineGraph();

        this.marker = this.vis
          .append('circle')
          .attr('r', 4)
          .style('fill', '#FFFFFF')
          .style('display', 'none')
          .style('pointer-events', 'none')
          .style('stroke', 'orange')
          .style('stroke-width', '2px');

        if (this.elevationMarkerPosition) {
          this.moveHandlerToCoordinate(this.elevationMarkerPosition);
        }

        if (this.elevationMarkerVisible === true) {
          this.showHandler();
        }

        this.elevationText = this.vis
          .append('text')
          .attr('class', 'elevation-label')
          .attr('x', 70)
          .attr('y', this.margins.top);

        this.vis.on('mouseover', () => this.elevationLineOver.emit());

        this.vis.on('mouseout', () => this.elevationLineOut.emit());

        this.vis.on('mousemove', () => {
          if (!this.markerOn) {
            const mouse = d3Mouse(d3Event.currentTarget);
            const pos = this._eventToPosition(mouse[0]);

            if (pos) {
              this.elevationLineMove.emit(pos);
            }
          }
        });

        this.vis.on('click', () => {
          const mouse = d3Mouse(d3Event.currentTarget);
          const pos = this._eventToPosition(mouse[0]);
          this.elevationLineClick.emit(pos);
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public moveHandlerToCoordinate(position: GeoJSON.Position) {
    if (this._elevationData !== null) {
      const lineData = this._elevationData.lineData;
      const xRange = this._elevationData.xRange;
      const yRange = this._elevationData.yRange;
      const coordinates = this.route.path.coordinates;

      const distance = this._geospatial.distanceOnLine(coordinates[0], position, this.route.route.features[0]) / 1000;

      const bisect = d3Bisector((d: [number, number]) => {
        return d[0];
      }).right;

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

  public showHandler(show = true) {
    if (this.marker) {
      if (show === true) {
        this.marker.style('display', 'inherit');
      } else {
        this.marker.style('display', 'none');
      }
    }
  }

  protected _eventToPosition(eventX: number): GeoJSON.Position | null {
    let trackPoint: GeoJSON.Position = null;

    if (this._elevationData !== null) {
      const lineData = this._elevationData.lineData;
      const xRange = this._elevationData.xRange;
      const bisect = d3Bisector((d: [number, number]) => {
        return d[0];
      }).right;

      const x = xRange.invert(eventX);
      const index = bisect(lineData, x);

      trackPoint = this._routeService.getTrackPoint(this.route, index);
    }

    return trackPoint;
  }

  private _addYAxis() {
    // The vertical axis
    const yAxisVertical = d3AxisLeft(this._elevationData.yRange).tickSize(5);

    this.vis
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(${this.margins.left}, 0)`)
      .call(yAxisVertical);

    // The grid lines
    const lineWidth = this.width - this.margins.left - this.margins.right;
    const yAxisLines = d3AxisRight(this._elevationData.yRange).tickSize(lineWidth);

    function customYAxis(g) {
      g.call(yAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    }

    this.vis
      .append('svg:g')
      .attr('class', 'axis-grid')
      .attr('transform', `translate(${this.margins.left}, 0)`)
      .call(customYAxis);
  }

  private _addXAxis() {
    // The vertical axis
    const xAxisHorizontal = d3AxisBottom(this._elevationData.xRange).tickSize(5);

    this.vis
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
      .call(xAxisHorizontal);

    // The grid lines
    const lineHeight = this.height - this.margins.top - this.margins.bottom;

    const xAxisLines = d3AxisTop(this._elevationData.xRange).tickSize(lineHeight);

    function customXAxis(g) {
      g.call(xAxisLines);
      g.select('.domain').remove();
      g.selectAll('.tick line')
        .attr('stroke', '#777')
        .attr('stroke-dasharray', '2,2');

      g.selectAll('text').remove();
    }

    this.vis
      .append('svg:g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
      .call(customXAxis);
  }

  private _addLineGraph() {
    const line = this._elevationData.lineFunc(this._elevationData.lineData);

    if (line !== null) {
      this.vis
        .append('svg:path')
        .attr('d', line)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', 'none');
    }
  }

  private _addFilledArea() {
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

    this.vis
      .append('svg:path')
      .attr('d', area)
      .attr('fill', 'url(#areaGradient)');
  }
}
