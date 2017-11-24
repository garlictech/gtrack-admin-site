
import { Component } from '@angular/core';
import { IExternalPoiType } from '../../../../shared/interfaces/index';

@Component({
  selector: 'gt-hike-edit-pois',
  templateUrl: './hike-edit-pois.component.html'
})
export class HikeEditPoisComponent {
  public externalPoiTypes: IExternalPoiType[] = [
    {
      title: 'Wikipedia pois',
      subdomain: 'wikipedia',
      getAction: 'getWikipediaPois',
      setAction: 'setWikipediaPois'
    }, {
      title: 'Google pois',
      subdomain: 'google',
      getAction: 'getGooglePois',
      setAction: 'setGooglePois'
    }, {
      title: 'OSM Natural pois',
      subdomain: 'osmNatural',
      getAction: 'getOsmNaturalPois',
      setAction: 'setOsmNaturalPois'
    }, {
      title: 'OSM Amenity pois',
      subdomain: 'osmAmenity',
      getAction: 'getOsmAmenityPois',
      setAction: 'setOsmAmenityPois'
    }, {
      title: 'OSM Route pois',
      subdomain: 'osmRoute',
      getAction: 'getOsmRoutePois',
      setAction: 'setOsmRoutePois'
    }
  ];
}
