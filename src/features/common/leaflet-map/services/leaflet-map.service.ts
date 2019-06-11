// tslint:disable:no-import-side-effect
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import 'overlapping-marker-spiderfier-leaflet';
// tslint:enable:no-import-side-effect

import { GeoJsonObject } from 'geojson';

import { Injectable } from '@angular/core';
import { RouteData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { Store } from '@ngrx/store';

import {
  Center,
  EMarkerType,
  LayerDef,
  LeafletEventEmitterMap,
  LeafletMapConfig,
  LeafletTileLayerDef
} from '../interfaces';
import { CurrentPositionMarker } from '../services/lib/current-position-marker';
import { leafletMapActions } from '../store';

declare const OverlappingMarkerSpiderfier;

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {
  leafletMap: L.Map;
  overlappingMarkerSpiderfier: any;

  baseLayers: LeafletTileLayerDef;
  overlayLayers: LeafletTileLayerDef;
  geoJSONLayerGroup: L.GeoJSON;

  protected _currentPositionMarker: CurrentPositionMarker;

  constructor(private readonly _store: Store<any>) {
    this.baseLayers = {};
    this.overlayLayers = {};
  }

  createMap(
    id: string,
    nativeMapElement: any,
    center: Center,
    layers: Array<LayerDef>,
    overlays: Array<LayerDef>,
    activeOverlays: Array<string>,
    mapConfig: LeafletMapConfig
  ): void {
    this.leafletMap = new L.Map(nativeMapElement);
    this.leafletMap.setView([center.lat, center.lng], center.zoom);

    //
    // Layers
    //

    layers.forEach((layer: LayerDef, index: number) => {
      const tileLayer = L.tileLayer(layer.url);

      if (index === 0) {
        tileLayer.addTo(this.leafletMap);
      }

      this.baseLayers[layer.name] = tileLayer;
    });

    overlays.forEach((layer: LayerDef) => {
      const tileLayer = L.tileLayer(layer.url);

      if (activeOverlays.indexOf(layer.name) !== -1) {
        tileLayer.addTo(this.leafletMap);
      }

      this.overlayLayers[layer.name] = tileLayer;
    });

    const layersControl = L.control.layers(this.baseLayers, this.overlayLayers).addTo(this.leafletMap);

    // Fullscreen control
    if (typeof mapConfig.fullScreenControl !== 'undefined') {
      (L.control as any).fullscreen(mapConfig.fullScreenControl).addTo(this.leafletMap);
    }

    // Spiderfier
    if (typeof mapConfig.spiderfier !== 'undefined') {
      this.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(this.leafletMap, mapConfig.spiderfier);
    }

    // Controls
    if (typeof mapConfig.controls !== 'undefined' && !mapConfig.controls.layers) {
      layersControl.remove();
    }

    // Later we can use this id to access multiple maps
    // Now we use only for checking map availability
    this._store.dispatch(new leafletMapActions.RegisterMap(id));
  }

  registerEventEmitters(eventEmitters: LeafletEventEmitterMap): void {
    if (this.leafletMap) {
      for (const key in eventEmitters) {
        if (eventEmitters[key] && eventEmitters[key].observers.length > 0) {
          this.leafletMap.on(key, (e: L.LeafletMouseEvent) => {
            eventEmitters[key].emit(e);
          });
        }
      }
    }
  }

  fitBounds(box: L.LatLngBoundsExpression, maxZoom?: number): void {
    if (this.leafletMap) {
      this.leafletMap.invalidateSize();

      const options: L.FitBoundsOptions = {
        padding: [50, 50]
      };

      if (maxZoom) {
        options.maxZoom = maxZoom;
      }

      this.leafletMap.fitBounds(box, options);
    }
  }

  fitRouteBounds(route: RouteData): void {
    const bounds: L.LatLngBoundsExpression = [
      [route.bounds.NorthEast.lat, route.bounds.NorthEast.lon],
      [route.bounds.SouthWest.lat, route.bounds.SouthWest.lon]
    ];

    this.fitBounds(bounds);
  }

  getCurrentPositionMarker(): CurrentPositionMarker {
    if (!this._currentPositionMarker) {
      this._currentPositionMarker = new CurrentPositionMarker(this.leafletMap);
    }

    return this._currentPositionMarker;
  }

  addGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyle: any): L.GeoJSON {
    const geoJSON = L.geoJSON(geoJson, {
      style: geoJsonStyle
    });

    if (this.geoJSONLayerGroup) {
      this.geoJSONLayerGroup.addLayer(geoJSON);
    } else {
      this.geoJSONLayerGroup = geoJSON;
    }

    return this.addLayer(geoJSON) as L.GeoJSON;
  }

  createFeatureGroupFromGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyles: Array<any>): L.FeatureGroup {
    const featureGroup = L.featureGroup();

    geoJsonStyles.forEach(geoJsonStyle => {
      const geoJSON = L.geoJSON(geoJson, {
        style: geoJsonStyle
      });

      featureGroup.addLayer(geoJSON);
    });

    return featureGroup;
  }

  addLayer(layer: any): any {
    if (layer && this.leafletMap && !this.leafletMap.hasLayer(layer)) {
      this.leafletMap.addLayer(layer);
    }

    return layer;
  }

  removeLayer(layer: any): void {
    if (layer && this.leafletMap && this.leafletMap.hasLayer(layer)) {
      this.leafletMap.removeLayer(layer);
    }
    if (layer && this.geoJSONLayerGroup && this.geoJSONLayerGroup.hasLayer(layer)) {
      this.geoJSONLayerGroup.removeLayer(layer);
    }
  }

  createMarkersGroup(markers: Array<L.Marker> | Array<any>): L.LayerGroup {
    return L.layerGroup(markers);
  }

  refreshSpiderfierMarkers(markers: Array<L.Marker>, type: EMarkerType): void {
    if (typeof this.overlappingMarkerSpiderfier !== 'undefined') {
      for (const marker of this.overlappingMarkerSpiderfier.markers.filter(m => m.options.type === type)) {
        this.overlappingMarkerSpiderfier.removeMarker(marker);
      }

      for (const marker of markers) {
        (marker as any).options.type = type; // For safety's sake
        this.overlappingMarkerSpiderfier.addMarker(marker);
      }
    }
  }

  updateFeature(oldId: number, newLayer: GeoJsonObject): number {
    this.removeLayer(this.geoJSONLayerGroup.getLayer(oldId));
    const layer = this.addGeoJSONObject(newLayer, undefined);

    return this.geoJSONLayerGroup.getLayerId(layer);
  }
}
