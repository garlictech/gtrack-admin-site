import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import * as togpx from 'togpx';

import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';

import { HikeProgram } from '../../services/hike-program/hike-program';
import { PoiSelectors } from '../../store/poi/selectors';
import { RouteSelectors } from '../../store/route/selectors';

import * as PoiActions from '../../store/poi/actions';
import * as RouteActions from '../../store/route/actions';

@Component({
  selector: 'gtrack-common-download-gpx',
  template: ''
})
export class DownloadGpxButtonComponent implements OnInit {
  @Input() hikeProgram: HikeProgram;

  constructor(
    private readonly _store: Store<any>,
    private readonly _routeSelectors: RouteSelectors,
    private readonly _poiSelectors: PoiSelectors
  ) {}

  ngOnInit(): void {
    const poiIds = this.hikeProgram.stops.map(stop => stop.poiId);
    this._store
      .pipe(
        select(this._routeSelectors.getRouteContext(this.hikeProgram.routeId)),
        take(1)
      )
      .subscribe(context => {
        const loaded = _get(context, 'loaded', false);
        const loading = _get(context, 'loading', false);

        if (!loaded && !loading) {
          this._store.dispatch(new RouteActions.LoadRoute(this.hikeProgram.routeId));
        }
      });

    this._store
      .pipe(
        select(this._poiSelectors.getPoiContextEntities(poiIds)),
        take(1)
      )
      .subscribe(contexts => {
        const notLoaded = poiIds
          .filter(id => !/^endpoint/.test(id))
          .filter(id => {
            const context = contexts[id];
            const loaded = _get(context, 'loaded', false);
            const loading = _get(context, 'loading', false);

            return !loaded && !loading;
          });

        if (notLoaded.length > 0) {
          this._store.dispatch(new PoiActions.LoadPois(notLoaded));
        }
      });
  }

  onClick(e: Event): void {
    e.preventDefault();

    const poiIds = this.hikeProgram.stops.map(stop => stop.poiId);

    observableCombineLatest(
      this._store.pipe(select(this._routeSelectors.getRoute(this.hikeProgram.routeId))),
      this._store.pipe(select(this._poiSelectors.getPois(poiIds)))
    )
      .pipe(take(1))
      .subscribe(results => {
        const route = results[0];
        const pois = results[1];
        const locale = 'en_US'; // TODO: Use the locale settings

        const geojson = _cloneDeep(route.route);
        const points: Array<GeoJSON.Feature<GeoJSON.Point>> = pois.map(poi => ({
          type: 'Feature' as 'Feature',
          geometry: {
            type: 'Point' as 'Point',
            coordinates: [poi.lon, poi.lat]
          },
          properties: {
            title: _get(poi.description, `${locale}.title`, '')
          }
        }));

        geojson.features = [
          ...[geojson.features[0]], // Route line
          ...points
        ];

        const xml = togpx(geojson);
        const file = new Blob([xml], {
          type: 'text/xml'
        });
        const url = URL.createObjectURL(file);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${this.hikeProgram.id}.gpx`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
