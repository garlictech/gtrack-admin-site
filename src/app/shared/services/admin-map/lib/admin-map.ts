import { Store } from '@ngrx/store';
import { State, adminMapActions } from 'app/store';
import { Observable } from 'rxjs/Observable';
import { HikeEditRoutePlannerSelectors } from 'app/store/selectors';
import { Map, IconService, MapMarkerService } from 'subrepos/gtrack-common-ngx/app';

import * as L from 'leaflet';
import * as turf from '@turf/turf';
import * as _ from 'lodash';

export class AdminMap extends Map {
  public markersGroup: L.LayerGroup;

  constructor(
    public id: string,
    protected map: L.Map,
    protected iconService: IconService,
    protected mapMarkerService: MapMarkerService,
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors
  ) {
    super(id, map, iconService, mapMarkerService);
  }

  /**
   * Get buffer geoJSON
   */
  public getBuffer(): Observable<GeoJSON.Feature<GeoJSON.Polygon> | undefined> {
    // Update totals on each segment update
    return this._store
      .select(this._hikeEditRoutePlannerSelectors.getPath)
      .take(1)
      .map((path) => {
        if (typeof path !== 'undefined') {
          let _buffer = <GeoJSON.Feature<GeoJSON.Polygon>>turf.buffer(
            path, 50, {units: 'meters'}
          );

          if (typeof _buffer !== 'undefined') {
            _buffer = _.assign(_buffer, {
              properties: {
                name: 'buffer polygon',
                draw_type: 'small_buffer'
              }
            });
          }
          console.log('TEST BUFFER', _buffer);
          return _buffer;
        } else {
          return;
        }
      });
  }

  /**
   * Add buffer geoJSON to map
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
   *
   * TODO: when called with route_{n} ???
   */
  private _getGeoJsonStyle(feature) {
    switch (feature.properties.draw_type) {
      case 'route_0':
        return { color: 'black', opacity: 0.15, weight: 9 };
      case 'route_1':
        return { color: 'white', opacity: 0.8, weight: 6 };
      case 'route_2':
        return { color: 'red', opacity: 1, weight: 2 };
      case 'small_buffer':
        return { color: '#000044', weight: 2, fillColor: '#000077' };
    }
  }

  /**
   * addGeoJSON submethod
   */
  private _propagateClick(feature, layer) {
    layer.on('click', event => {
      this.map.fireEvent('click', {
        latlng: event.latlng,
        layerPoint: this.map.latLngToLayerPoint(event.latlng),
        containerPoint: this.map.latLngToContainerPoint(event.latlng)
      });

      console.log('TEST _propagateClick', {
        latlng: event.latlng,
        layerPoint: this.map.latLngToLayerPoint(event.latlng),
        containerPoint: this.map.latLngToContainerPoint(event.latlng)
      });
    });
  }

  /**
   * Remove buffer geoJSON from map
   */
  public removeGeoJSON(geojson) {
    if (geojson) {
      this.map.removeLayer(geojson);
    }
  }
}
