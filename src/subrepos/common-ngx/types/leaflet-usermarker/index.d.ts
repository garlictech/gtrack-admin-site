// Type definitions for Leaflet.userMarker

/// <reference types="leaflet" />

declare namespace L {
    interface UserMarker extends L.Marker {
        options: UserMarkerOptions,

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

    interface UserMarkerOptions {
        pulsing?: boolean;
        smallIcon?: boolean;
        accuracy?: number;
        circleOpts?: UserMarkerCircleStyleOptions
    }

    function userMarker(latlng: LatLngExpression, options: UserMarkerOptions): UserMarker;
}
