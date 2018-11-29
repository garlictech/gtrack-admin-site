import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ICenter, ILayerDef, ILeafletMapConfig } from '@common.features/leaflet-map/interfaces';
import {
  DEFAULT_LAYERS, DEFAULT_OVERLAY_LAYERS, DEFAULT_LEAFLET_MAP_CONFIG
} from '@common.features/leaflet-map/constants';
import { LeafletMapService } from '@common.features/leaflet-map/services/leaflet-map.service';
import { CurrentPositionMarker } from '@common.features/leaflet-map/services/lib/current-position-marker';

import * as L from 'leaflet';

@Component({
  selector: 'gtrack-leaflet-map',
  styleUrls: ['./style.scss'],
  templateUrl: './ui.html'
})
export class LeafletMapComponent implements OnInit {
  @ViewChild('map') private _map: ElementRef;

  @Input() id = 'leafletMap';
  @Input() center: ICenter;
  @Input() layers: ILayerDef[] = DEFAULT_LAYERS;
  @Input() overlays: ILayerDef[] = DEFAULT_OVERLAY_LAYERS;
  @Input() activeOverlays: string[] = [];
  @Input() config: ILeafletMapConfig = DEFAULT_LEAFLET_MAP_CONFIG;

  // Optional leaflet event emitters
  @Output() mapClick: EventEmitter<L.LeafletMouseEvent> = new EventEmitter<L.LeafletMouseEvent>();
  @Output() mapMouseDown: EventEmitter<L.LeafletMouseEvent> = new EventEmitter<L.LeafletMouseEvent>();
  @Output() mapMouseUp: EventEmitter<L.LeafletMouseEvent> = new EventEmitter<L.LeafletMouseEvent>();
  @Output() mapMouseOut: EventEmitter<L.LeafletMouseEvent> = new EventEmitter<L.LeafletMouseEvent>();
  @Output() mapMouseMove: EventEmitter<L.LeafletMouseEvent> = new EventEmitter<L.LeafletMouseEvent>();

  constructor(
    private _leafletMapService: LeafletMapService
  ) {}

  ngOnInit() {
    this._leafletMapService.createMap(
      this.id, this._map.nativeElement, this.center, this.layers, this.overlays, this.activeOverlays, this.config
    );

    this._leafletMapService.registerEventEmitters({
      'click': this.mapClick,
      'mousedown': this.mapMouseDown,
      'mouseup': this.mapMouseUp,
      'mouseout': this.mapMouseOut,
      'mousemove': this.mapMouseMove
      // ...
    });
  }

  public get leafletMap(): L.Map {
    return this._leafletMapService.leafletMap;
  }

  public get currentPositionMarker(): CurrentPositionMarker {
    return this._leafletMapService.getCurrentPositionMarker();
  }
}
