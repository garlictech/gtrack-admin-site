import { Component, AfterViewInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';

import { MapService, Map } from '../map';

export interface Center {
  lat: number;
  lng: number;
  zoom: number;
}

@Component({
  selector: 'gc-leaflet',
  template: `
    <div #map class="angular-leaflet-map"><ng-content></ng-content></div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class LeafletComponent implements AfterViewInit {
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

  public tileLayers: {
    [key: string]: L.TileLayer;
  } = {};

  public control: L.Control;

  @Input()
  public markers: any;

  @Input()
  public path: any;

  constructor(private mapService: MapService) { }

  ngAfterViewInit() {
    this.leafletMap = new L.Map(this.mapElement.nativeElement);

    this.leafletMap.setView([this.center.lat, this.center.lng], this.center.zoom);

    this.layers.reverse().forEach((layer) => {
      let tileLayer = L.tileLayer(layer.url, layer);
      tileLayer.addTo(this.leafletMap);
      this.tileLayers[layer.name] = tileLayer;
    });

    this.control = L.control.layers(this.tileLayers).addTo(this.leafletMap);
    this.map = this.mapService.get(this.leafletMap);
  }
}
