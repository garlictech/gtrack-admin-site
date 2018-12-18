import { LeafletMapMarkerService } from '../leaflet-map-marker.service';
import { LeafletMapMarker } from './leaflet-map-marker';
import { LeafletMarkerPopupService } from '../leaflet-marker-popup.service';

import { DescriptionLanguageListService } from 'subrepos/gtrack-common-ngx/app/localize';
import { IPoi, IHikeProgramStop } from 'subrepos/provider-client';

import * as L from 'leaflet';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';

//
//
// DEPRECATED ???
//
//

export class LeafletPointMarker {
  public markers: LeafletMapMarker[] = [];
  public shownOnMap = false;

  constructor(
    protected map: L.Map,
    private _leafletMapMarkerService: LeafletMapMarkerService,
    private _descriptionLanguageList: DescriptionLanguageListService,
    private _markerPopup: LeafletMarkerPopupService
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
      const poiStop = stops.find(stop => stop.poiId === poi.id);

      const popupData = {
        popupComponentName: 'MarkerPopupComponent',
        markerClickCallback: this._markerPopup.onUserMarkerClick,
        closeCallback: () => {
          this.map.closePopup();
        },
        map: this.map,
        data: {
          poi: _cloneDeep(poi),
          stop: poiStop
        }
      };

      const marker = this._leafletMapMarkerService.create(
        poi.lat,
        poi.lon,
        poi.types,
        _get(description, 'title', ''),
        null,
        popupData
      );
      this.markers.push(marker);

      if (this.shownOnMap === true) {
        marker.addToMap(this.map);
      }
    });
  }
}
