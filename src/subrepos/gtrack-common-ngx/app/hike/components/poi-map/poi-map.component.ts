import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';

import { take } from 'rxjs/operators';

<<<<<<< HEAD
import { LeafletComponent, MapMarkerService, Center } from '../../../map';
=======
import {
  LeafletComponent,
  MapMarkerService,
  Center
} from '../../../map';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import { Poi } from '../../services/poi';
import { DescriptionLanguageListService } from '../../../localize';

@Component({
<<<<<<< HEAD
  selector: 'gtrack-poi-map',
=======
  selector: 'gtcn-poi-map',
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
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
<<<<<<< HEAD
      .pipe(take(1))
=======
      .pipe(
        take(1)
      )
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
      .subscribe(description => {
        const marker = this._mapMarker.create(this.poi.lat, this.poi.lon, this.poi.types, description.title);

        marker.addToMap(this.map.leafletMap);
      });

    this.map.leafletMap.setView([this.poi.lat, this.poi.lon], this.zoom);
  }
}
