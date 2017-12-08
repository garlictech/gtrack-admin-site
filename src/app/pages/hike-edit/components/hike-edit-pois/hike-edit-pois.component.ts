
import { Component } from '@angular/core';
import { IExternalPoiType } from 'app/shared/interfaces/index';

@Component({
  selector: 'gt-hike-edit-pois',
  templateUrl: './hike-edit-pois.component.html'
})
export class HikeEditPoisComponent {
  public externalPoiTypes: IExternalPoiType[] = [
    {
      title: 'Wikipedia pois',
      subdomain: 'wikipedia',
      getAction: 'GetWikipediaPois',
      setAction: 'SetWikipediaPois'
    }, {
      title: 'Google pois',
      subdomain: 'google',
      getAction: 'GetGooglePois',
      setAction: 'SetGooglePois'
    }, {
      title: 'OSM Natural pois',
      subdomain: 'osmNatural',
      getAction: 'GetOsmNaturalPois',
      setAction: 'SetOsmNaturalPois'
    }, {
      title: 'OSM Amenity pois',
      subdomain: 'osmAmenity',
      getAction: 'GetOsmAmenityPois',
      setAction: 'SetOsmAmenityPois'
    }, {
      title: 'OSM Route pois',
      subdomain: 'osmRoute',
      getAction: 'GetOsmRoutePois',
      setAction: 'SetOsmRoutePois'
    }
  ];
}
