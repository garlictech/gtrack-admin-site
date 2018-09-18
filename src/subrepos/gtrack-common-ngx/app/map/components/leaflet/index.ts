import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';

import { MapService, Map } from '../../services/map';

export interface Center {
  lat: number;
  lng: number;
  zoom: number;
}

@Component({
<<<<<<< HEAD
  selector: 'gtrack-leaflet',
=======
  selector: 'gtcn-leaflet',
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
  template: `
    <div #map class="angular-leaflet-map"><ng-content></ng-content></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LeafletComponent implements OnInit {
  @ViewChild('map')
  public mapElement: ElementRef;

  public map: Map;

  public leafletMap: L.Map;

  @Input()
  public center: Center;

  @Input()
  public layers = [
    {
      name: 'street',
      url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  ];

  @Input()
  public overlays = [
    {
      name: 'trails',
      url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
    }
  ];

  @Input()
  public activeOverlays: string[] = [];

  public baseLayers: {
    [key: string]: L.TileLayer;
  } = {};

  public overlayLayers: {
    [key: string]: L.TileLayer;
  } = {};

  public control: L.Control;

  @Input()
  public markers: any;

  @Input()
  public path: any;

  constructor(protected mapService: MapService) {}

  ngOnInit() {
    this.leafletMap = new L.Map(this.mapElement.nativeElement);

    this.leafletMap.setView([this.center.lat, this.center.lng], this.center.zoom);

    this.layers.forEach((layer, index) => {
      const tileLayer = L.tileLayer(layer.url, layer);

      if (index === 0) {
        tileLayer.addTo(this.leafletMap);
      }

      this.baseLayers[layer.name] = tileLayer;
    });

    this.overlays.forEach(layer => {
      const tileLayer = L.tileLayer(layer.url, layer);

      if (this.activeOverlays.indexOf(layer.name) !== -1) {
        tileLayer.addTo(this.leafletMap);
      }

      this.overlayLayers[layer.name] = tileLayer;
    });

    this.control = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.leafletMap);
    this.map = this.mapService.get(this.leafletMap);
  }
}
