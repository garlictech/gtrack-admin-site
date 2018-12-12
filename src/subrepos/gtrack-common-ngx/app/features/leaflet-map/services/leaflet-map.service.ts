import { Injectable } from '@angular/core';
import {
  ICenter, ILayerDef, ILeafletTileLayerDef, ILeafletEventEmitterMap, ILeafletMapConfig, EMarkerType
} from '@common.features/leaflet-map/interfaces';
import { CurrentPositionMarker } from '@common.features/leaflet-map/services/lib/current-position-marker';

import * as L from 'leaflet';
import 'leaflet.fullscreen';
import 'overlapping-marker-spiderfier-leaflet';
import { GeoJsonObject } from 'geojson';
import { Store } from '@ngrx/store';
import { leafletMapActions } from '../store';

declare const OverlappingMarkerSpiderfier;

@Injectable()
export class LeafletMapService {
  public leafletMap: L.Map;
  public overlappingMarkerSpiderfier: any;

  public baseLayers: ILeafletTileLayerDef = {};
  public overlayLayers: ILeafletTileLayerDef = {};

  protected _currentPositionMarker: CurrentPositionMarker;

  constructor(
    private _store: Store<any>,
  ) {}

  public createMap(
    id: string,
    nativeMapElement: any,
    center: ICenter,
    layers: ILayerDef[],
    overlays: ILayerDef[],
    activeOverlays: string[],
    mapConfig: ILeafletMapConfig
  ) {
    this.leafletMap = new L.Map(nativeMapElement);
    this.leafletMap.setView([center.lat, center.lng], center.zoom);

    //
    // Layers
    //

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

    // Fullscreen control
    if (typeof mapConfig.fullScreenControl !== 'undefined') {
      (<any>L.control).fullscreen(mapConfig.fullScreenControl)
      .addTo(this.leafletMap);
    }

    // Spiderfier
    if (typeof mapConfig.spiderfier !== 'undefined') {
      this.overlappingMarkerSpiderfier = new OverlappingMarkerSpiderfier(this.leafletMap, mapConfig.spiderfier);
    }

    // Later we can use this id to access multiple maps
    // Now we use only for checking map availability
    this._store.dispatch(new leafletMapActions.RegisterMap(id));
  }

  public registerEventEmitters(eventEmitters: ILeafletEventEmitterMap): void {
    for (const key in eventEmitters) {
      if (eventEmitters[key] && eventEmitters[key].observers.length > 0) {
        this.leafletMap.on(key, (e: L.LeafletMouseEvent) => {
          eventEmitters[key].emit(e);
        });
      }
    }
  }

  public fitBounds(box: L.LatLngBoundsExpression): L.Map {
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

  public addGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyle: any): L.GeoJSON<any> {
    const geoJSON = L.geoJSON(geoJson, {
      style: geoJsonStyle,
      // onEachFeature: this._propagateClick // ??? legacy from old code
    });

    return <L.GeoJSON<any>>this.addLayer(geoJSON);
  }

  /*
  private _propagateClick = (feature, layer) => {
    layer.on('click', event => {
      // L.DomEvent.stopPropagation(event);

      this.leafletMap.fireEvent('click', {
        latlng: event.latlng,
        layerPoint: this.leafletMap.latLngToLayerPoint(event.latlng),
        containerPoint: this.leafletMap.latLngToContainerPoint(event.latlng)
      });
    });
  }
  */

  public createFeatureGroupFromGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyles: any[]): L.FeatureGroup {
    const featureGroup = L.featureGroup();

    geoJsonStyles.map(geoJsonStyle => {
      const geoJSON = L.geoJSON(geoJson, {
        style: geoJsonStyle
      });

      featureGroup.addLayer(geoJSON);
    });

    return featureGroup;
  }

  public addLayer(layer: any): any {
    if (layer && !this.leafletMap.hasLayer(layer)) {
      this.leafletMap.addLayer(layer);
    }

    return layer;
  }

  public removeLayer(layer: any) {
    if (layer && this.leafletMap.hasLayer(layer)) {
      this.leafletMap.removeLayer(layer);
    }
  }

  public createMarkersGroup(markers: L.Marker[] | any[]): L.LayerGroup {
    return L.layerGroup(markers);
  }

  public refreshSpiderfierMarkers(markers: L.Marker[], type: EMarkerType) {
    if (typeof this.overlappingMarkerSpiderfier !== 'undefined') {
      for (const marker of this.overlappingMarkerSpiderfier.markers.filter(m => m.options.type === type)) {
        this.overlappingMarkerSpiderfier.removeMarker(marker);
      }

      for (const marker of markers) {
        (<any>marker).options.type = type; // For safety's sake
        this.overlappingMarkerSpiderfier.addMarker(marker);
      }
    }
  }
}
