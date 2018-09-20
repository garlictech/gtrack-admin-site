import { Store, select } from '@ngrx/store';
import { State } from '../../../../store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { HikeEditRoutePlannerSelectors } from '../../../../store/selectors';
import { Map, IconService, MapMarkerService, DescriptionLanguageListService, MarkerPopupService } from 'subrepos/gtrack-common-ngx/app';

import * as L from 'leaflet';
import 'leaflet.fullscreen';
import turfBuffer from '@turf/buffer';
import _assign from 'lodash-es/assign';

export class AdminMap extends Map {
  public markersGroup: L.LayerGroup;
  public overlappingMarkerSpiderfier: any;

  constructor(
    public id: string,
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    protected _descriptionLanguageList: DescriptionLanguageListService,
    protected _markerPopup: MarkerPopupService
  ) {
    super(id, map, iconService, mapMarkerService, _store, _descriptionLanguageList, _markerPopup);

    (<any>L.control).fullscreen({
      position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, defaut topleft
      title: 'Show me the fullscreen !', // change the title of the button, default Full Screen
      titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
      content: null, // change the content of the button, can be HTML, default null
      forceSeparateButton: true, // force seperate button to detach from zoom buttons, default false
      forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    }).addTo(this.map);
  }

  /**
   * Get buffer geoJSON
   */
  public getBuffer(): Observable<GeoJSON.Feature<GeoJSON.Polygon> | undefined> {
    // Update totals on each segment update
    return this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getPath),
        take(1),
        map(path => {
          if (typeof path !== 'undefined') {
            let _buffer = <GeoJSON.Feature<GeoJSON.Polygon>>turfBuffer(path, 50, { units: 'meters' });

            if (typeof _buffer !== 'undefined') {
              _buffer = _assign(_buffer, {
                properties: {
                  name: 'buffer polygon',
                  draw_type: 'small_buffer'
                }
              });
            }

            return _buffer;
          } else {
            return;
          }
        })
      );
  }

  /**
   * Add geoJSON to map
   */
  public addGeoJSON(geoJson): L.GeoJSON {
    const _geoJSON = L.geoJSON(geoJson, {
      style: <any>this._getGeoJsonStyle(geoJson),
      onEachFeature: this._propagateClick
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
        return { color: '#000044', weight: 6, fillColor: '#000077' };
    }
  }

  /**
   * addGeoJSON submethod
   */
  private _propagateClick(feature, layer) {
    layer.on('click', event => {
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
}
