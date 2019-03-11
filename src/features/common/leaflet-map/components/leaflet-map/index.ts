import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DEFAULT_LAYERS, DEFAULT_LEAFLET_MAP_CONFIG, DEFAULT_OVERLAY_LAYERS } from '../../constants';
import { Center, LayerDef, LeafletMapConfig } from '../../interfaces';
import { LeafletMapService } from '../../services/leaflet-map.service';
import { CurrentPositionMarker } from '../../services/lib/current-position-marker';

import * as L from 'leaflet';

@Component({
  selector: 'gtrack-leaflet-map',
  styleUrls: ['./style.scss'],
  templateUrl: './ui.html'
})
export class LeafletMapComponent implements OnInit {
  get leafletMap(): L.Map {
    return this._leafletMapService.leafletMap;
  }

  get currentPositionMarker(): CurrentPositionMarker {
    return this._leafletMapService.getCurrentPositionMarker();
  }

  @Input() id: string;
  @Input() center: Center;
  @Input() layers: Array<LayerDef>;
  @Input() overlays: Array<LayerDef>;
  @Input() activeOverlays: Array<string>;
  @Input() config: LeafletMapConfig;
  @Input() rounded: boolean;

  // Optional leaflet event emitters
  @Output() readonly mapClick: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseDown: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseUp: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseOut: EventEmitter<L.LeafletMouseEvent>;
  @Output() readonly mapMouseMove: EventEmitter<L.LeafletMouseEvent>;

  @ViewChild('map') private readonly _map: ElementRef;

  constructor(private readonly _leafletMapService: LeafletMapService) {
    this.id = 'leafletMap';
    this.layers = DEFAULT_LAYERS;
    this.overlays = DEFAULT_OVERLAY_LAYERS;
    this.activeOverlays = [];
    this.config = DEFAULT_LEAFLET_MAP_CONFIG;
    this.rounded = false;

    this.mapClick = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseDown = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseUp = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseOut = new EventEmitter<L.LeafletMouseEvent>();
    this.mapMouseMove = new EventEmitter<L.LeafletMouseEvent>();
  }

  ngOnInit(): void {
    this._leafletMapService.createMap(
      this.id,
      this._map.nativeElement,
      this.center,
      this.layers,
      this.overlays,
      this.activeOverlays,
      this.config
    );

    this._leafletMapService.registerEventEmitters({
      click: this.mapClick,
      mousedown: this.mapMouseDown,
      mouseup: this.mapMouseUp,
      mouseout: this.mapMouseOut,
      mousemove: this.mapMouseMove
      // ...
    });
  }
}
