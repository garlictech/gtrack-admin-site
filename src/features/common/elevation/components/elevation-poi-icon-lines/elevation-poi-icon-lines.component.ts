import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import { ElevationData, PoiData, RouteData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-poi-icon-lines]',
  templateUrl: './elevation-poi-icon-lines.component.html',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationPoiIconLinesComponent implements OnInit, OnChanges {
  @Input() pois: Array<PoiData>;
  @Input() route: RouteData;
  @Input() elevationData: ElevationData;
  @Input() lineHeight: number;

  lines: Array<number>;

  constructor(private readonly _geospatial: GeospatialService) {
    this.lines = [];
  }

  ngOnInit(): void {
    this._initLines();
  }

  ngOnChanges(): void {
    this._initLines();
  }

  trackByFn(index: number): number {
    return index;
  }

  private _initLines(): void {
    this.lines = [];

    if (this.pois instanceof Array && this.route && this.elevationData) {
      this.lines = this.pois.map(poi => this._convertPoiToLine(poi));
    }
  }

  private _convertPoiToLine(poi: PoiData): number {
    const coordinates = this.route.route.features[0].geometry.coordinates;
    const xRange = this.elevationData.xRange;

    const distance =
      this._geospatial.distanceOnLine(coordinates[0], [poi.lon, poi.lat], this.route.route.features[0]) / 1000;

    return xRange(distance);
  }
}
