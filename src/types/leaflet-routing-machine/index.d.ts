import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    /**
     * Classes
     */

    class Control extends Itinerary {
      constructor(options?: ControlOptions);
      onAdd(map: Map): HTMLElement;
      on(eventName: string, fn: ControlEventHandlerFn): this;
      onRemove(map: Map): this;
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: Waypoint[]): this;
      spliceWaypoints(start?: number, end?: number, waypoint?: Waypoint | any): Waypoint[];
      getPlan(): Plan;
      getRouter(): Router;
      route(options?: RouteOptions);
    }

    class Line extends L.LayerGroup {
      constructor(route: Route, options: LineOptions);
      getBounds(): LatLngBounds;
    }

    class OSRMv1 extends L.Class {
      constructor(options: OSRMv1Options);
      route(waypoints: Waypoint[], callback: Function, context: any, options: any);
      requiresMoreDetail(route: Route, zoom: number, bounds: LatLngBounds): boolean;
      buildRouteUrl(waypoints: Waypoint[], options: any): string;
    }

    class Plan extends L.Class {
      constructor(waypoints?: Waypoint[], options?: PlanOptions);
      isReady(): boolean;
      getWaypoints(): Waypoint[];
      setWaypoints(waypoints: Waypoint[]): this;
      spliceWaypoints(start?: number, end?: number, waypoint?: Waypoint | any): Waypoint[];
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): this;
      createGeocoders(): HTMLElement;
      dragNewWaypoint(e: Event): this;
    }

    class Autocomplete extends L.Class {
      constructor(elem: HTMLElement, callback: Function, context: any, options: AutocompleteOptions);
      close(): this;
    }

    class Formatter extends L.Class {
      constructor(options?: FormatterOptions);
      formatDistance(distance: number, sensitivity: number): string;
      formatTime(time: number): string;
      formatInstruction(instruction: FormatterInstruction, i: number): string;
      getIconName(instruction: FormatterInstruction, i: number): string;
      capitalize(s: string): string;
    }

    class GeocoderElement extends L.Class {
      constructor(wp?: Waypoint, i?: number, nWps?: number, options?: GeocoderOptions);
      getContainer(): HTMLElement;
      setValue(v: string): this;
      update(force: boolean): this;
      focus(): this;
    }

    class Localization extends L.Class {
      constructor(langs?: string[]);
      localize(keys: any): string;
    }

    class Itinerary extends L.Control {
      constructor(options?: ItineraryOptions);
      onAdd(map: Map): HTMLElement;
      onRemove(map?: Map): this;
      createAlternativesContainer(): HTMLElement;
      setAlternatives(routes: Route[]): this;
      show(): this;
      hide(): this;
    }

    class ItineraryBuilder extends L.Class {
      constructor(options?: ItineraryBuilderOptions);
      createContainer(className?: string): HTMLElement;
      createStepsContainer(): HTMLElement;
      createStep(text?: string, distance?: string, icon?: string, steps?: string): HTMLElement;
    }

    /**
     * Interfaces for Control
     */

    interface ControlOptions {
      fitSelectedRoutes?: string;
      router?: Router;
      formatter?: L.Routing.Valhalla.Formatter;
      plan?: L.Routing.Plan,
      routeLine?(route, options): Line;
      autoRoute?: boolean;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      showAlternatives?: boolean;
      defaultErrorHandler?(e: Event);
    }

    type ControlEventHandlerFn = (event: ControlEvent) => void;

    interface ControlEvent extends Event {
      waypoints?: any; // Waypoint[];
      alts?: any; //Waypoint[];
      routes?: any; // Route[];
    }

    interface Router {
      route(
        waypoints: Waypoint[],
        callback: (parameter: RouterCallbackParameter) => void, context: any, options?: RoutingOptions
      );
    }

    interface Waypoint {
      latLng?: L.LatLng;
      name?: string;
      options?: WaypointOptions;
    }

    interface WaypointOptions {
      allowUTurn?: boolean;
    }

    interface RouterCallbackParameter {
      status?: number;
      message?: string;
    }

    interface RoutingOptions {
      alternatives?: boolean;
      steps?: boolean;
    }

    interface RouteOptions {
      z: number;
      waypoints?: Array<Waypoint>;
      geometryOnly?: boolean;
      simplifyGeometry?: boolean;
      callback();
    }

    /**
     * Interfaces for Line
     */

    interface LineOptions {
      styles?: LineStyles[];
      missingRouteStyles?: MissingRouteStyles[];
      addWaypoints?: boolean;
			extendToWaypoints?: boolean;
			missingRouteTolerance?: number;
    }

    interface LineStyles {
      color?: string;
      opacity?: number;
      weight?: number;
    }

    interface MissingRouteStyles{
      color?: string;
      opacity?: number;
      weight?: number;
      dashArray?: string;
    }

    /**
     * Interfaces for OSRMv1
     */

    interface OSRMv1Options {
      serviceUrl?: string;
      profile?: string;
      timeout?: number;
      routingOptions?: RouteOptions;
      polylinePrecision?: number;
      useHints?: boolean;
      suppressDemoServerWarning?: boolean;
      language?: string;
    }

    /**
     * Interfaces for Plan
     */

    interface PlanOptions {
      dragStyles?: DragStyles[];
      draggableWaypoints?: boolean;
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      reverseWaypoints?: boolean;
      addButtonClassName?: string;
      language?: string;
      createGeocoderElement?(wp?: Waypoint, i?: number, nWps?: number, options?): GeocoderElement;
      createMarker?(i?, wp?: Waypoint);
      geocodersClassName?: string;
    }

    interface DragStyles {
      color?: string;
      opacity?: number;
      weight?: number;
      dashArray?: string;
    }

    /**
     * Interfaces for Autocomplete
     */

    interface AutocompleteOptions {
      timeout?: number;
			blurTimeout?: number;
			noResultsMessage?: string;
    }

    /**
     * Interfaces for Formatter
     */

    interface FormatterOptions {
      units?: string;
      unitNames?: {
        [key: string]: string
      };
      language?: string;
      roundingSensitivity?: number;
      distanceTemplate?: string;
    }

    interface FormatterInstruction {
      text?: string;
      type?: string;
      modifier?: string;
      direction?: string;
      exit?: string;
    }

    /**
     * Interfaces for Geocoder
     */

    interface GeocoderOptions {
      createGeocoder(i?: number, nWps?: number, options?: GeocoderOptions): Geocoder;
      geocoderPlaceholder(i?: number, nWps?: number, element?: GeocoderElement): string;
      geocoderClass(): string;
      waypointNameFallback(latLng?: LatLng): string;
      maxGeocoderTolerance: number;
			autocompleteOptions: any;
			language: string;
    }

    interface Geocoder {
      container: HTMLElement;
      input: HTMLElement;
      closeButton: HTMLElement;
    }

    /**
     * Interfaces for Itinerary
     */

    interface ItineraryOptions {
      pointMarkerStyle?: {
        radius: number;
        color: string;
        fillColor: string;
        opacity: number;
        fillOpacity: number;
      };
      summaryTemplate?: string;
      timeTemplate?: string;
      containerClassName?: string;
      alternativeClassName?: string;
      minimizedClassName?: string;
      itineraryClassName?: string;
      totalDistanceRoundingSensitivity?: number;
      show?: boolean;
      collapsible?: boolean;
      collapseBtn(itinerary: Itinerary);
      collapseBtnClass?: string;
    }

    interface Route {
      coordinates: number[][];
      inputWaypoints: Waypoint[];
      waypointIndices: number[];
    }

    /**
     * Interfaces for ItineraryBuilder
     */

    interface ItineraryBuilderOptions {
      containerClassName?: string;
    }
  }
}
