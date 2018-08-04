const {
  ProvidePlugin
} = require('webpack');

exports.myConstants = {
  MY_VENDOR_DLLS: [
    "@mapbox/corslite",
    "@mapbox/polyline",
    "@mapbox/togeojson",
    "@turf/turf",
    "angular2-toaster",
    "d3",
    "d3-geo",
    "flat",
    "geojson-rewind",
    "geojson-validation",
    "intl",
    "ngx-chips",
    "tether",
    "angular2-file-drop",
    "enum-values",
    "leaflet",
    "leaflet-spin",
    "leaflet-usermarker",
    "load-google-maps-api",
    "moment",
    "ng2-nouislider",
    "nouislider",
    "popper.js",
    "spin.js",
    "webfontloader",
    "raven-js",
    "google-libphonenumber",
    "password-validator",
    "@garlictech/deepstream-rxjs",
    "lrm-graphhopper",
    "togpx",
    "ngx-md",
    "quill"
  ],
  MY_CLIENT_PLUGINS: [
    new ProvidePlugin({
      Quill: "quill"
    })
  ]
};
