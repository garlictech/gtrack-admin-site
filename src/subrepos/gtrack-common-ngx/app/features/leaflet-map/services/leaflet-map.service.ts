import { Injectable, Inject } from '@angular/core';
import {
  ICenter, ILayerDef, ILeafletTileLayerDef, ILeafletEventEmitterMap, ILeafletMapConfig
} from '@common.features/leaflet-map/interfaces';
import { CurrentPositionMarker } from '@common.features/leaflet-map/services/lib/current-position-marker';

import * as L from 'leaflet';
import 'leaflet.fullscreen';
import { GeoJsonObject } from 'geojson';

@Injectable()
export class LeafletMapService {
  public leafletMap: L.Map;

  public baseLayers: ILeafletTileLayerDef = {};
  public overlayLayers: ILeafletTileLayerDef = {};

  protected _currentPositionMarker: CurrentPositionMarker;

  public createMap(
    nativeMapElement: any,
    center: ICenter,
    layers: ILayerDef[],
    overlays: ILayerDef[],
    activeOverlays: string[],
    mapConfig: ILeafletMapConfig
  ) {
    this.leafletMap = new L.Map(nativeMapElement);
    this.leafletMap.setView([center.lat, center.lng], center.zoom);

    layers.forEach((layer: ILayerDef, index: number) => {
      const tileLayer = L.tileLayer(layer.url);

      if (index === 0) {
        tileLayer.addTo(this.leafletMap);
      }

      this.baseLayers[layer.name] = tileLayer;
    });

    overlays.forEach((layer: ILayerDef) => {
      const tileLayer = L.tileLayer(layer.url);

      if (activeOverlays.indexOf(layer.name) !== -1) {
        tileLayer.addTo(this.leafletMap);
      }

      this.overlayLayers[layer.name] = tileLayer;
    });

    L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.leafletMap);

    if (mapConfig.fullScreenControl) {
      (<any>L.control).fullscreen({
        forceSeparateButton: true,
        forcePseudoFullscreen: true
      })
      .addTo(this.leafletMap);
    }
  }

  public registerEventEmitters(eventEmitters: ILeafletEventEmitterMap) {
    for (const key in eventEmitters) {
      if (eventEmitters[key]) {
        this.leafletMap.on(key, (e: L.LeafletMouseEvent) => {
          eventEmitters[key].emit(e);
        });
      }
    }
  }

  public fitBounds(box: L.LatLngBoundsExpression) {
    this.leafletMap.invalidateSize();

    return this.leafletMap.fitBounds(box, {
      padding: [50, 50]
    });
  }

  public getCurrentPositionMarker(): CurrentPositionMarker {
    if (!this._currentPositionMarker) {
      this._currentPositionMarker = new CurrentPositionMarker(this.leafletMap);
    }

    return this._currentPositionMarker;
  }

  /**
   * Add geoJSON layer to map
   */
  public addGeoJSON(geoJson: GeoJsonObject, geoJsonStyle: any): L.GeoJSON {
    const _geoJSON = L.geoJSON(geoJson, {
      style: geoJsonStyle //  <any>this._getGeoJsonStyle(geoJson),
      // onEachFeature: this._propagateClick // ??
    });
    _geoJSON.addTo(this.leafletMap);

    return _geoJSON;
  }
}
