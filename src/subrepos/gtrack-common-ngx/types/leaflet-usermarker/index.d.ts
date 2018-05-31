// Type definitions for Leaflet.userMarker

import * as L from 'leaflet';

declare module 'leaflet' {
  interface UserMarker extends L.Marker {
    options: UserMarkerOptions;

    initialize(latlng: LatLngExpression, options: UserMarkerOptions);

    setPulsing(pulsing: boolean);

    setAccuracy(accuracy: number);

    onAdd(map: L.Map);
  }

  interface UserMarkerCircleStyleOptions {
    stroke?: boolean;
    color?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
    fillColor?: number;
    clickable?: boolean;
  }

  interface UserMarkerOptions extends L.MarkerOptions {
    pulsing?: boolean;
    smallIcon?: boolean;
    accuracy?: number;
    circleOpts?: UserMarkerCircleStyleOptions;
  }

  function userMarker(latlng: LatLngExpression, options: UserMarkerOptions): UserMarker;
}
