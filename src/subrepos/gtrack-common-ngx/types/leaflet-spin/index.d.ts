// Type definitions for Leaflet.spin

/// <reference types="spin.js" />

import * as L from 'leaflet';

declare module 'leaflet' {
  interface Map {
    spin(state: boolean, options?: SpinnerOptions);
  }
}
