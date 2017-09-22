// Type definitions for Leaflet.spin

/// <reference types="spin.js" />
/// <reference types="leaflet" />

declare namespace L {
  interface Map {
    spin(state: boolean, options?: SpinnerOptions);
  }
}
