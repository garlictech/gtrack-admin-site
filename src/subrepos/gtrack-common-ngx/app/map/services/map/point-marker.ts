import * as L from 'leaflet';

import { MapMarker, MapMarkerService, MarkerPopupService } from '../map-marker';
import { IPoi, IHikeProgramStop } from '../../../../../provider-client';

import { DescriptionLanguageListService } from '../../../localize';

import * as _ from 'lodash';

export class PointMarker {
  public markers: MapMarker[] = [];
  public shownOnMap = false;

  constructor(
    protected map: L.Map,
    private mapMarkerService: MapMarkerService,
    private _descriptionLanguageList: DescriptionLanguageListService,
    private _markerPopup: MarkerPopupService
  ) {}

  public addMarkersToMap() {
    this.markers.forEach(marker => {
      marker.addToMap(this.map);
    });

    this.shownOnMap = true;
  }

  public removeMarkersFromMap() {
    this.markers.forEach(marker => marker.removeFromMap(this.map));
    this.shownOnMap = false;
  }

  public removeMarkers() {
    this.markers = [];
  }

  public addMarkers(pois: IPoi[], stops: IHikeProgramStop[] = []) {
    pois.forEach((poi, i) => {
      const description = this._descriptionLanguageList.getLocalizedDescription(poi.description);
      const poiStop = stops.find(stop => (stop.poiId === poi.id));

      const popupData = {
        popupComponentName: 'MarkerPopupComponent',
        markerClickCallback: this._markerPopup.onUserMarkerClick,
        closeCallback: () => {
          this.map.closePopup();
        },
        map: this.map,
        data: {
          poi: _.cloneDeep(poi),
          stop: poiStop
        }
      };

      let marker = this.mapMarkerService.create(poi.lat, poi.lon, poi.types, _.get(description, 'title', ''), popupData);
      this.markers.push(marker);

      if (this.shownOnMap === true) {
        marker.addToMap(this.map);
      }
    });
  }
}
