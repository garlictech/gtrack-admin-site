import * as L from 'leaflet';

declare module 'leaflet' {
    interface WaypointOptions {
      allowUTurn: boolean;
    }

    interface Waypoint {
      latLng: L.LatLng;
      name: string;
      options: WaypointOptions;
    }

    interface RoutingOptions {
      alternatives: boolean;
      steps: boolean;
    }

    interface RouterCallbackParameter {
      status: number;
      message: string;
    }

    interface Router {
      route(waypoints: [Waypoint], callback: (parameter: RouterCallbackParameter) => void, context: any, options: RoutingOptions);
    }

    interface FormatterOptions {
      units: string;
      unitNames: {
        [key: string]: string
      };
      language: string;
      roundingSensitivity: number;
      distanceTemplate: string;
    }

    interface Instruction {
      text: string;
      type: string;
      modifier: string;
      direction: string;
      exit: string;
    }

    class Formatter {
      initialize(options: FormatterOptions);
      formatDistance(distance: number, sensitivity: number): string;
      formatTime(time: number): string;
      formatInstruction(instruction: Instruction, i: number): string;
      getIconName(instruction: Instruction, i: number): string;
      capitalize(s: string): string;
    }

    namespace Routing {
      class Control {
        constructor(options?: ControlOptions);
      }
    }    

    interface ControlOptions {
      fitSelectedRoutes?: string;
      router: Router;
      formatter: Formatter;
      routeLine(route, options);
      autoRoute?: boolean;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      showAlternatives?: boolean;
      defaultErrorHandler(e);
    }
}
