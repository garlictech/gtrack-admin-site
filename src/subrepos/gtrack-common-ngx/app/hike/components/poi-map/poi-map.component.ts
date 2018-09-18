import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';

import { take } from 'rxjs/operators';

import { LeafletComponent, MapMarkerService, Center } from '../../../map';

import { Poi } from '../../services/poi';
import { DescriptionLanguageListService } from '../../../localize';

@Component({
  selector: 'gtrack-poi-map',
  template: ''
})
export class PoiMapComponent implements AfterViewInit {
  @Input()
  public poi: Poi;

  @Input()
  public zoom = 15;

  public layers = [
    {
      name: 'street',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
      name: 'topo',
      url: 'https://opentopomap.org/{z}/{x}/{y}.png'
    }
  ];

  public center = <Center>{
    lat: 47.497912,
    lng: 19.040235,
    zoom: 14
  };

  @ViewChild('map')
  public map: LeafletComponent;

  constructor(
    protected _mapMarker: MapMarkerService,
    protected _descriptionLanguageList: DescriptionLanguageListService
  ) {}

  ngAfterViewInit() {
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
