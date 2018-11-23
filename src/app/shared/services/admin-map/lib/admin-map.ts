import { Store } from '@ngrx/store';
import { State } from '../../../../store';
import {
  Map,
  IconService,
  MapMarkerService,
  DescriptionLanguageListService,
  MarkerPopupService
} from 'subrepos/gtrack-common-ngx/app';

import * as L from 'leaflet';
import 'overlapping-marker-spiderfier-leaflet';
import 'leaflet.fullscreen';
import _assign from 'lodash-es/assign';
import { EAdminMarkerType } from '../admin-map.service';
import { GeoJsonObject } from 'geojson';

declare const OverlappingMarkerSpiderfier;

export class AdminMap extends Map {
  public markersGroup: L.LayerGroup;
  public overlappingMarkerSpiderfier: any;

  constructor(
    public id: string,
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    protected _descriptionLanguageList: DescriptionLanguageListService,
    protected _markerPopup: MarkerPopupService
  ) {
    super(id, map, iconService, mapMarkerService, _store, _descriptionLanguageList, _markerPopup);

    (<any>L.control)
      .fullscreen({
        position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
        title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
        titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
        content: null, // change the content of the button, can be HTML, default null
        forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
        forcePseudoFullscreen: true // force use of pseudo full screen even if full screen API is available, default false
      })
      .addTo(this.map);

    this.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(this.map, {
      keepSpiderfied: true
    });
  }

  /**
   * Add geoJSON layer to map
   */
  public addGeoJSON(geoJson: GeoJsonObject): L.GeoJSON {
    const _geoJSON = L.geoJSON(geoJson, {
      style: <any>this._getGeoJsonStyle(geoJson),
      // onEachFeature: this._propagateClick // ??
    });
    _geoJSON.addTo(this.leafletMap);

    return _geoJSON;
  }

  /**
   * addGeoJSON submethod
   */
  private _getGeoJsonStyle(feature) {
    switch (feature.properties.draw_type) {
      case 'small_buffer':
        return { color: '#000044', weight: 1, fillColor: '#000077' };
      case 'big_buffer':
        return { color: '#000044', weight: 1, fillColor: '#000077' };
    }
  }

  /**
   * addGeoJSON submethod
   */
  private _propagateClick = (feature, layer) => {
    layer.on('click', event => {
      // L.DomEvent.stopPropagation(event);

      this.map.fireEvent('click', {
        latlng: event.latlng,
        layerPoint: this.map.latLngToLayerPoint(event.latlng),
        containerPoint: this.map.latLngToContainerPoint(event.latlng)
      });
    });
  }

  /**
   * Remove geoJSON from map
   */
  public removeGeoJSON(geojson) {
    if (geojson) {
      this.map.removeLayer(geojson);
    }
  }

  public refreshSpiderfierMarkers(markers: L.Marker[], type: EAdminMarkerType) {
    for (const marker of this.overlappingMarkerSpiderfier.markers.filter(m => m.options.type === type)) {
      this.overlappingMarkerSpiderfier.removeMarker(marker);
    }

    for (const marker of markers) {
      this.overlappingMarkerSpiderfier.addMarker(marker);
    }
  }
}
