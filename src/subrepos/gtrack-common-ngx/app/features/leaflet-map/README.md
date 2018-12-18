
# Leaflet Map

Find it in the `leaflet-map` block, in the subrepos and in te apps. Main purpose: add a Leaflet-based interactive map component that could be used in the whole app.

You should control the map elements through the main `LeafletMapComponent` and the `LeafletMapService`.

## Basic Map

You can create a very basic map with the following code blocks:

*module.ts*
```
import { LeafletMapModule } from  '@common.features/leaflet-map/leaflet-map.module';

@NgModule({
    imports: [
        ...
        LeafletMapModule
    ]
})
```

*map-page.component.ts*
```
import { ICenter } from  '@common.features/leaflet-map/interfaces';

...

export class MapPageComponent implements OnInit {
    public center: ICenter = {
        lat: 47.689714,
        lng: 18.904206,
        zoom: 12
    };
  ...
```

*map-page.component.html*
```
<gtrack-leaflet-map [center]="center"></gtrack-leaflet-map>
```

## Full-featured Map

You can pass additional parameters to the map, as you can see the example below.

*map-page.component.ts*
```
import { ILeafletMapConfig, ICenter, ILayerDef } from  '@common.features/leaflet-map/interfaces';
import * as L from 'leaflet';

...

public mapConfig: ILeafletMapConfig = {
    fullScreenControl: {
        forceSeparateButton: true,
        forcePseudoFullscreen: true
    },
    spiderfier: {
        keepSpiderfied: true
    }
};

public center: ICenter  = {
    lat: 47.689714,
    lng: 18.904206,
    zoom: 12
};

public layers: ILayerDef[] = [{
    name: 'street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}, {
    name: 'topo',
    url: 'https://opentopomap.org/{z}/{x}/{y}.png'
}];

public overlays: ILayerDef[] = [{
    name: 'trails',
    url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
}];;

...

public onMapClick(e: L.LeafletMouseEvent) {
    console.log('Clicked at', e.latlng);
}
```

map-page.component.html
```
<gtrack-leaflet-map
    #map
    [id]="'mapId'"
    [layers]="layers"
    [overlays]="overlays"
    [center]="center"
    [config]="mapConfig"
    (mapClick)="onMapClick($event)"
></gtrack-leaflet-map>
```

## Component inputs

|Key|Type|Default|Required|Description|
|--|--|--|--|--|
|[id]|string|'leafletMap'|false|Map id (currently unused)|
|[layers]|ILayerDef|street and topo map|false|Base layers for the map|
|[overlays]|ILayerDef|trails|false|Overlay (transparent) layers for the map|
|[center]|ICenter|-|**true**|Center and zoom level of the map|
|[config]|ILeafletMapConfig|All plugins turned off|false|See the config description below|
|(mapClick)|EventEmitter|-|false|Callback for click event|
|(mapMouseDown)|EventEmitter|-|false|Callback for mouseDown event|
|(mapMouseUp)|EventEmitter|-|false|Callback for mouseOut event|
|(mapMouseOut)|EventEmitter|-|false|Callback for mouseOut event|
|(mapMouseMove)|EventEmitter|-|false|Callback for mouseMove event|

## Component properties

|Property|Description|
|--|--|
|map.leafletMap|Getter for LeafletMapService.leafletMap|
|map.currentPositionMarker|Getter for LeafletMapService.currentPositionMarker|

Access to the map:
```
@ViewChild('map') public map: LeafletMapComponent;
```

### Leaflet Map

You have direct access to the map throught the leafletMap property:

```
this.map.leafletMap.scrollWheelZoom.enable();
```

### Current position marker

You can set the marker to a specified *[lat, lng]* position with the following code:

```
this.map.currentPositionMarker.goToPosition(L.latLng(lat, lng));
```

## LeafletMap service

|Method|Description|
|--|--|
|fitBounds(box: L.LatLngBoundsExpression)|Fit the map to the given bounds.|
|getCurrentPositionMarker(): CurrentPositionMarker|Access to currentPositionMarker.|
|addGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyle: any): L.GeoJSON|Create L.GeoJSON from a plain geoJSON object and add it to the map.|
|createFeatureGroupFromGeoJSONObject(geoJson: GeoJsonObject, geoJsonStyles: any[]): L.FeatureGroup |Create L.FeatureGroup from a plain geoJSON object with the given style and add it to the map. You can use it to display multi-coloured routes.|
|addLayer(layer: L.Layer): L.Layer|Add a leaflet layer (L.Marker / L.FeatureGroup / L.LayerGroup) to the map.|
|removeLayer(layer: L.Layer)|Remove the given layer from the map.|
|createMarkersGroup(markers: L.Marker[] | any[]): L.LayerGroup|Create L.LayerGroup with the given markers|
|refreshSpiderfierMarkers(markers: L.Marker[], type: EMarkerType)|Refresh the spiderfier markers (associated with the given type) on the map.|

## Map config

|Key|Type|Default|Required|Description|
|--|--|--|--|--|
|fullScreenControl|config object|-|false|Add a [Leaflet.Control.FullScreen](https://github.com/brunob/leaflet.fullscreen) control to the map. See the linked documentation for the details.|
|spiderfier|config object|-|false|Turn on [Overlapping Marker Spiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet) for the markers.


## Markers

You can create markers with the `LeafletMapMarkerService.create()` method.

**Mandatory parameters:**

|param|type|description|
|--|--|--|
|lat|number|lattitude value|
|lon|number|longitude value|
|types|string[]|icon types|
|title|string|On-hover title|

**Optional parameters:**

|param|type|description|
|--|--|--|
|additionalData|any|object with key-value pairs, filled with what you need :)|
|popupData|ILeafletMarkerPopupData|Configuration object for open a popup window on marker click.|

**Marker popup:**

You can insert a custom component template to the marker popup. First, you have to use these mandatory properties on your custom component:

*marker-popup.component.ts*
```
    // AoT build changes the property names so you have to define as static
    public static componentName = 'YourCustomComponentToInsert';

    // These two properties will be filled in by LeafletMarkerPopupService
    public data: any; // { name: 'John Doe' }
    public closePopup: any;
```


*map-page.component.ts*
```
import { LeafletMapMarkerService } from '@common.features/leaflet-map/services/leaflet-map-marker.service';
import { ILeafletMarkerPopupData } from '@common.features/leaflet-map/interfaces';

...
constructor(
    private _leafletMapMarkerService: LeafletMapMarkerService,
    private _markerPopupService: LeafletMarkerPopupService,
)

...

export class MapPageComponent implements OnInit {
  ...
    private _createMarker() {
        const popupData: IMarkerPopupData = {
            popupComponentName: 'YourCustomComponentToInsert',
            markerClickCallback: this._markerPopupService.onUserMarkerClick,
            closeCallback: () => {
                this._leafletMapService.leafletMap.closePopup();
                ...
            },
            map: this._leafletMapService.leafletMap,
            data: {
                name: 'John Doe'
            }
        };

        const _marker = this._leafletMapMarkerService.create(
            lat,
            lon,
            ['cafe'],
            'Cafe',
            { someKey: 'someValue' },   // Optional
            popupData                   // Optional
        );

        // For filtering spiderfier
        // See leafletMap service.refreshSpiderfierMarkers above
        _marker.marker.options.type = EMarkerType.POI;

        // Add markers to the map
        this._markersGroup = this._leafletMapService.createMarkersGroup([_marker.marker]);
        this._leafletMapService.addLayer(this._markersGroup);
    }
```

**ILeafletMarkerPopupData properties**

|param|type|description|
|--|--|--|
|popupComponentName|string|value of the *componentName* property on your component|
|markerClickCallback|func|Use *this._markerPopupService.onUserMarkerClick* or create your own callback method :)|
|closeCallback|func|run your custom code on popup close|
|map|L.Map|Fixed value: *this._leafletMapService.leafletMap*
|data|any|Custom data for popup. See the *marker-popup.component.ts* description|
