declare namespace L {
    interface Routing {
      control(options?: ControlOptions);
      itinerary(options);
      line(route, options);
      plan(waypoints, options);
      waypoint(latLng, name, options);
      osrmv1(options);
      localization(options);
      formatter(options);
      geocoderElement(wp, i, nWps, plan);
      itineraryBuilder(options);
      mapbox(accessToken, options);
      errorControl(routingControl, options);
      autocomplete(elem, callback, context, options);
    }

    interface ControlOptions {
      fitSelectedRoutes?: string;
      routeLine(route, options);
      autoRoute?: boolean;
      routeWhileDragging?: boolean;
      routeDragInterval?: number;
      waypointMode?: string;
      showAlternatives?: boolean;
      defaultErrorHandler(e);
    }
}
