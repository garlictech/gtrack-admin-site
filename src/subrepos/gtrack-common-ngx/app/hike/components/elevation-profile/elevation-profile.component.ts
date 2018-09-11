import { Store } from '@ngrx/store';

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

import * as d3 from 'd3';
import * as _ from 'lodash';

import { State } from 'app/store';
import { Subject } from 'rxjs/Subject';

import { DistancePipe, UnitsService } from '../../../shared';
import { Route, RouteService, IElevationData } from '../../services/route';
import { RouteSelectors } from '../../store/route/selectors';
import * as routeActions from '../../store/route/actions';
import { HikeProgram } from '../../services/hike-program';
import { GeospatialService } from '../../../shared/services/geospatial';

@Component({
  selector: 'gtcn-elevation-profile',
  template: ''
})
export class ElevationProfileComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('elevationProfile')
  public mainDiv: ElementRef;

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

  public route: Route | null;
  public marker: d3.Selection<d3.BaseType, {}, null, undefined>;
  public elevationText: d3.Selection<d3.BaseType, {}, null, undefined>;

  protected vis: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected res: IElevationData | null = null;
  protected markerOn = false;
  protected distance: DistancePipe;

  private _destroy$ = new Subject<boolean>();

  constructor(
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
      .select(this._routeSelectors.getRouteContext(routeId))
      .takeUntil(this._destroy$)
      .subscribe(context => {
        if (typeof context === 'undefined' || (context.loaded !== true && context.loading !== true)) {
          this._store.dispatch(new routeActions.LoadRoute(routeId));
        }
      });

    this._store
      .select(this._routeSelectors.getRoute(routeId))
      .takeUntil(this._destroy$)
      .filter(route => typeof route !== 'undefined')
      .map(route => {
        if (route) {
          return new Route(route);
        }
      })
      .subscribe(route => {
        if (!route) {
          throw new Error(`Route ${routeId} is unknown`);
        }

        this.route = route;

        if (!this.vis) {
          this.vis = d3
            .select(this.mainDiv.nativeElement)
            .append('svg')
            .attr('viewBox', `0, 0, ${this.width}, ${this.height}`);
        }

        this.res = this._routeService.elevationData(route, this.width, this.height, this.margins);

        if (this.res === null) {
          return;
        }

        const xAxis = d3.axisBottom(this.res.xRange).tickSize(5);

        const yAxis = d3.axisLeft(this.res.yRange).tickSize(5);

        this.vis
          .append('svg:g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
          .call(xAxis);

        this.vis
          .append('svg:g')
          .attr('class', 'y axis')
          .attr('transform', `translate(${this.margins.left}, 0)`)
          .call(yAxis);

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

        const line = this.res.lineFunc(this.res.lineData);

        if (line !== null) {
          this.vis
            .append('svg:path')
            .attr('d', line)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        }

        this.vis.on('mouseover', () => this.elevationLineOver.emit());

        this.vis.on('mouseout', () => this.elevationLineOut.emit());

        this.vis.on('mousemove', () => {
          if (!this.markerOn) {
            const mouse = d3.mouse(d3.event.currentTarget);
            const pos = this._eventToPosition(mouse[0]);

            if (pos) {
              this.elevationLineMove.emit(pos);
            }
          }
        });

        this.vis.on('click', () => {
          const mouse = d3.mouse(d3.event.currentTarget);
          const pos = this._eventToPosition(mouse[0]);
          this.elevationLineClick.emit(pos);
        });
      });
  }

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

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public moveHandlerToCoordinate(position: GeoJSON.Position) {
    if (this.res !== null) {
      const lineData = this.res.lineData;
      const xRange = this.res.xRange;
      const yRange = this.res.yRange;
      const coordinates = this.route.path.coordinates;

      const distance = this._geospatial.distanceOnLine(coordinates[0], position, this.route.route.features[0]) / 1000;

      const bisect = d3.bisector((d: [number, number]) => {
        return d[0];
      }).right;

      const x = distance;

      const index = bisect(lineData, x);
      const startData = lineData[index - 1];
      const endData = lineData[index];

      if (startData && endData) {
        const interpolate = d3.interpolateNumber(startData[1], endData[1]);
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

    if (this.res !== null) {
      const lineData = this.res.lineData;
      const xRange = this.res.xRange;
      const bisect = d3.bisector((d: [number, number]) => {
        return d[0];
      }).right;

      const x = xRange.invert(eventX);
      const index = bisect(lineData, x);

      trackPoint = this._routeService.getTrackPoint(this.route, index);
    }

    return trackPoint;
  }
}
