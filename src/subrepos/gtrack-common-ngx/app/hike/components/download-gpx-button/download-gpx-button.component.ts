import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import * as togpx from 'togpx';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { HikeProgram } from '../../services/hike-program/hike-program';
import { RouteSelectors } from '../../store/route/selectors';
import { PoiSelectors } from '../../store/poi/selectors';

import * as RouteActions from 'subrepos/gtrack-common-ngx/app/hike/store/route/actions';
import * as PoiActions from 'subrepos/gtrack-common-ngx/app/hike/store/poi/actions';

@Component({
  selector: 'gc-download-gpx',
  templateUrl: './download-gpx-button.component.html',
  styleUrls: ['./download-gpx-button.component.scss']
})
export class DownloadGpxButtonComponent implements OnInit {
  @Input()
  public hikeProgram: HikeProgram;

  constructor(
    private _store: Store<any>,
    private _routeSelectors: RouteSelectors,
    private _poiSelectors: PoiSelectors
  ) { }

  ngOnInit() {
    let poiIds = this.hikeProgram.stops.map(stop => stop.poiId);
    this._store
      .select(this._routeSelectors.getRouteContext(this.hikeProgram.routeId))
      .take(1)
      .subscribe(context => {
        const loaded = _.get(context, 'loaded', false);
        const loading = _.get(context, 'loading', false);

        if (!loaded && !loading) {
          this._store.dispatch(new RouteActions.LoadRoute(this.hikeProgram.routeId));
        }
      });

    this._store
      .select(this._poiSelectors.getPoiContexts(poiIds))
      .take(1)
      .subscribe(contexts => {
        let notLoaded = contexts
          .filter(context => {
            const loaded = _.get(context, 'loaded', false);
            const loading = _.get(context, 'loading', false);

            return (!loaded && !loading);
          })
          .map(context => context.id);

        this._store.dispatch(new PoiActions.LoadPois(notLoaded));
      });
  }

  public onClick(e: Event) {
    e.preventDefault();

    let poiIds = this.hikeProgram.stops.map(stop => stop.poiId);

    Observable
      .combineLatest(
        this._store
          .select(this._routeSelectors.getRoute(this.hikeProgram.routeId)),
        this._store
          .select(this._poiSelectors.getPois(poiIds))
      )
      .take(1)
      .subscribe(results => {
        let route = results[0];
        let pois = results[1];
        let locale = 'en_US'; // TODO: Use the locale settings

        let geojson = _.cloneDeep(route.route);
        let points: GeoJSON.Feature<GeoJSON.Point>[] = pois.map(poi => ({
          type: 'Feature' as 'Feature',
          geometry: {
            type: 'Point' as 'Point',
            coordinates: [
              poi.lon,
              poi.lat
            ]
          },
          properties: {
            title: _.get(poi.description, `${locale}.title`, '')
          }
        }));

        geojson.features = [
          ...[geojson.features[0]], // Route line
          ...points
        ];

        let xml = togpx(geojson);
        let file = new Blob([xml], {
          type: 'text/xml'
        });
        let url = URL.createObjectURL(file);

        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${this.hikeProgram.id}.gpx`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
