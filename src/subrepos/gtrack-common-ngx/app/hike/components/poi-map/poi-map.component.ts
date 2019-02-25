import { take } from 'rxjs/operators';

import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { LeafletMapMarkerService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { LeafletMapComponent } from '@bit/garlictech.angular-features.common.leaflet-map/components/leaflet-map';
import { Center, LayerDef } from '@bit/garlictech.angular-features.common.leaflet-map/interfaces';
import { DescriptionLanguageListService } from '@bit/garlictech.angular-features.common.multi-language-text';

import { Poi } from '../../services/poi';

@Component({
  selector: 'gtrack-common-poi-map',
  template: ''
})
export class PoiMapComponent implements AfterViewInit {
  @Input() poi: Poi;

  @Input() zoom: number;

  layers: Array<LayerDef>;

  center: Center;

  @ViewChild('map') map: LeafletMapComponent;

  constructor(
    protected _mapMarker: LeafletMapMarkerService,
    protected _descriptionLanguageList: DescriptionLanguageListService
  ) {
    this.zoom = 15;

    this.layers = [
      {
        name: 'street',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      {
        name: 'topo',
        url: 'https://opentopomap.org/{z}/{x}/{y}.png'
      }
    ];

    this.center = {
      lat: 47.497912,
      lng: 19.040235,
      zoom: 14
    };
  }

  ngAfterViewInit(): void {
    this._descriptionLanguageList
      .getLocalizedDescription(this.poi.description)
      .pipe(take(1))
      .subscribe(description => {
        const marker = this._mapMarker.create(this.poi.lat, this.poi.lon, this.poi.types, description.title);

        marker.addToMap(this.map.leafletMap);
      });

    this.map.leafletMap.setView([this.poi.lat, this.poi.lon], this.zoom);
  }
}
