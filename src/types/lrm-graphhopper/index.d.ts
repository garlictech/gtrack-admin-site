import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    function graphHopper(apiKey: string, options: any): L.Routing.Router;
  }
}
