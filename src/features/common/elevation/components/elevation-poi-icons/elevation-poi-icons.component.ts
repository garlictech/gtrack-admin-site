import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { GeospatialService } from '@bit/garlictech.angular-features.common.geospatial';
import { ElevationData, PoiData, RouteData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MarkerIconsService } from '@bit/garlictech.angular-features.common.marker-icons';

import _get from 'lodash-es/get';
import { PoiIcon } from './poi-icon';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[gtrack-elevation-poi-icons]',
  templateUrl: './elevation-poi-icons.component.html',
  // tslint:disable-next-line: use-view-encapsulation
  encapsulation: ViewEncapsulation.None
})
export class ElevationPoiIconsComponent implements OnInit, OnChanges {
  @Input() pois: Array<PoiData>;
  @Input() route: RouteData;
  @Input() elevationData: ElevationData;
  @Input() iconWidth: number;
  @Input() iconHeight: number;

  @Output() readonly poiClick: EventEmitter<PoiData>;

  icons: Array<PoiIcon>;

  constructor(
    private readonly _geospatial: GeospatialService,
    private readonly _markerIconService: MarkerIconsService
  ) {
    this.poiClick = new EventEmitter<PoiData>();
    this.pois = [];
    this.icons = [];
    this.iconWidth = 32;
    this.iconHeight = 37;
  }

  ngOnInit(): void {
    this._initIcons();
  }

  ngOnChanges(): void {
    this._initIcons();
  }

  onClick(poi: PoiData): void {
    this.poiClick.next(poi);
  }

  trackByFn(index: number): number {
    return index;
  }

  private _initIcons(): void {
    this.icons = [];

    if (this.pois instanceof Array && this.route && this.elevationData) {
      this.icons = this.pois.map(poi => this._convertPoiToIcon(poi));
    }
  }

  private _convertPoiToIcon(poi: PoiData): PoiIcon {
    const coordinates = this.route.route.features[0].geometry.coordinates;
    const xRange = this.elevationData.xRange;

    const distance =
      this._geospatial.distanceOnLine(coordinates[0], [poi.lon, poi.lat], this.route.route.features[0]) / 1000;
    const type = _get(poi, 'types[0]', 'unknown');

    return {
      x: xRange(distance),
      url: this._markerIconService.getIcon(type, true),
      poi
    };
  }
}
