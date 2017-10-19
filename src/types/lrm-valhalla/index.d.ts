import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    function valhalla(apiKey: string, name: string): L.Router;

    namespace Valhalla {
      class Formatter extends L.Formatter {}
    }
  }
}