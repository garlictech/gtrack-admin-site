
import { Component } from '@angular/core';

interface IExternalPoiType {
  title: string;
  actionName: string;
  poiType?: string;
}

@Component({
  selector: 'gt-hike-edit-pois',
  templateUrl: './hike-edit-pois.component.html'
})
export class HikeEditPoisComponent {
  public externalPoiTypes: IExternalPoiType[] = [
    /*{
      title: 'Wikipedia pois',
      actionName: 'getWikipediaPois'
    }, {
      title: 'Google pois',
      actionName: 'getGooglePois'
    },*/ {
      title: 'OSM Natural pois',
      actionName: 'getOsmPois',
      poiType: 'natural'
    }, {
      title: 'OSM Amenity pois',
      actionName: 'getOsmPois',
      poiType: 'amenity'
    }
  ];
}
