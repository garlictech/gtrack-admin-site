import { Component, Input, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';

import { Hike } from '../../services/hike';
import { Route, RouteService } from '../../services/route';
import { LeafletComponent, Center } from '../../../map';

import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'gc-trail-box',
  templateUrl: './trail-box.component.html',
  styleUrls: ['./trail-box.component.scss']
})
export class TrailBoxComponent implements AfterViewInit {
  public layers = [
    {
      name: 'street',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
      name: 'topo',
      url: 'https://opentopomap.org/{z}/{x}/{y}.png'
    }
  ];

  public center = <Center>{
    lat: 51.505,
    lng: -0.09,
    zoom: 14
  }

  public offlineMap = false;

  @ViewChild('map')
  public map: LeafletComponent;

  @Input()
  public set hike(hike: Hike) {
    this.hike$.next(hike);

    if (hike) {
      this.routeService
        .get(hike.routeId)
        .subscribe((route: Route) => this.route$.next(route));
    }
  }

  public get hike(): Hike {
    return this.hike$.getValue();
  }

  public get route(): Route {
    return this.route$.getValue();
  }

  public route$ = new BehaviorSubject<Route>(null);
  public hike$ = new BehaviorSubject<Hike>(null);

  public checkpointsOnly = false;
  protected _geoJsons: L.GeoJSON[] = [];

  public constructor(
    private routeService: RouteService
  ) {}

  ngAfterViewInit() {
    let map = this.map.map;

    this.route$
      .filter((route: Route) => (route !== null))
      .subscribe((route: Route) => {
        this.clearGeoJson();
        for (let i = 0; i <= 2; i++) {
          let feature = Object.assign({}, route.geojson.features[0]);

          feature.properties = {
            draw_type: `route_${i}`
          };

          this.addGeoJson(feature, map.leafletMap);
        }

        map.fitBounds(route);
      });

    this.hike$
      .filter((hike: Hike) => (hike !== null))
      .subscribe((hike: Hike) => {
        map.pointMarker.addMarkers(hike.program.pois);
        map.checkpointMarker.removeCheckpointMarkers();
        map.checkpointMarker.addCheckpointMarkers(hike.program.checkpoints.checkpoints);
      });
  }

  addGeoJson(geojson: any, map: L.Map) {
    let response = L.geoJSON(geojson, {
      style: () => ({
        color: 'red',
        opacity: 1,
        weight: 2
      })
    });

    response.addTo(map);
    this._geoJsons.push(response);
  }

  clearGeoJson() {
    this._geoJsons.forEach((geojson: L.GeoJSON) => geojson.clearLayers());
    this._geoJsons = [];
  }

  goToCurrentPosition(e: Event) {
    e.preventDefault();
    let map = this.map.map;
    map.currentPositionMarker.goToCurrentPosition();
  }

  resetMap(e: Event) {
    e.preventDefault();
    let map = this.map.map;

    if (this.route) {
      map.fitBounds(this.route);
    }
  }

  showCheckpointsOnly(e: Event) {
    e.preventDefault();
    let map = this.map.map;
    let hike = this.hike$.getValue();

    if (hike) {
      let checkpoints = hike.program.checkpoints.checkpoints;

      if (this.checkpointsOnly === false) {
        this.checkpointsOnly = true;
        map.pointMarker.removeMarkers();
        map.checkpointMarker.showMarkers(checkpoints, true);
      }
    }
  }

  showAllPoints(e: Event) {
    e.preventDefault();
    let map = this.map.map;
    let hike = this.hike$.getValue();

    if (hike) {
      let checkpoints = hike.program.checkpoints.checkpoints;

      if (this.checkpointsOnly === true) {
        this.checkpointsOnly = false;
        map.pointMarker.addMarkers(hike.program.pois);
        map.checkpointMarker.showMarkers(checkpoints, false);
      }
    }
  }

}
