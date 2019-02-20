import * as fromGeoLocationActions from 'features/common/current-geolocation/store/actions';
import _get from 'lodash-es/get';
import { NEVER, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeoPosition } from '@features/common/current-geolocation';
import * as fromCurrentLocationSelectors from '@features/common/current-geolocation/store/selectors';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import distance from '@turf/distance';
import { Coord as turfCoord } from '@turf/helpers';

import * as geoSearchActions from '../../../geosearch/store/actions';
import * as searchFilterActions from '../../../search-filters/store/actions';
import { SearchFiltersSelectors } from '../../../search-filters/store/selectors';
import { GoogleMapsService } from '../../../shared';

@Component({
  selector: 'gtrack-common-location-search',
  template: ''
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  @Input() context: string;

  @Input() placeholder: string;

  icon: IconDefinition;

  radiusRange: number;

  protected _radius: number;
  protected _location?: GeoJSON.Position;
  protected _address: string;
  @ViewChild('search', { read: ElementRef }) _searchElementRef: ElementRef;

  private _input: HTMLElement;
  private readonly _destroy$: Subject<boolean>;
  private readonly _locate$: Subject<boolean>;

  constructor(
    private readonly _googleMapsService: GoogleMapsService,
    private readonly _ngZone: NgZone,
    private readonly _store: Store<any>,
    private readonly _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this.icon = faSearch;

    this.radiusRange = 50;

    this._radius = 50000;
    this._address = 'my-location';

    this._destroy$ = new Subject<boolean>();
    this._locate$ = new Subject<boolean>();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._store.dispatch(new fromGeoLocationActions.StartPositioning());
  }

  ngOnInit(): void {
    this._input = this._searchElementRef.nativeElement;

    if (!(this._input instanceof HTMLInputElement)) {
      const input = this._input.querySelector('input');

      if (input !== null) {
        this._input = input;
      }
    }

    if (this._input instanceof HTMLInputElement) {
      this._googleMapsService
        .autocomplete(this._input)
        .then(autocomplete => {
          autocomplete.addListener('place_changed', () => {
            this._ngZone.run(() => {
              const place = autocomplete.getPlace();

              if (typeof place.geometry === 'undefined' || place.geometry === null) {
                return undefined;
              }

              this._locate$.next(false);

              this._location = [place.geometry.location.lng(), place.geometry.location.lat()];
              this._address = place.formatted_address;
            });
          });
        })
        .catch(() => undefined);
    }

    this._store
      .pipe(
        select(fromCurrentLocationSelectors.selectTracking),
        take(1)
      )
      .subscribe(tracking => {
        if (!tracking) {
          this._store.dispatch(new fromGeoLocationActions.EndPositioning());
        }
      });

    this._initLocation();

    this._store
      .pipe(
        select(this._searchFiltersSelectors.getFilter('radius')),
        takeUntil(this._destroy$),
        filter(radius => !!radius && this._radius !== radius)
      )
      .subscribe(radius => {
        this._radius = radius;
        this._search();
      });
  }

  protected _search(): any {
    if (!this._location) {
      return undefined;
    }

    if (this._address) {
      this._store.dispatch(
        new searchFilterActions.ChangeFilters({
          location: this._address,
          center: this._location
        })
      );
    }

    this._store.dispatch(
      new geoSearchActions.SearchInCircle(
        {
          table: 'hike_programs',
          circle: {
            center: this._location,
            // TODO: get radius from input
            radius: this._radius
          }
        },
        this.context
      )
    );
  }

  searchLocation(): void {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
    }

    this._locate$.next(false);
    this._search();
  }

  requestLocation(): void {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
      this._location = undefined;
    }

    this._locate$.next(true);
  }

  onRadiusChange(data: number): void {
    this._radius = data * 1000;
    this._search();
  }

  private _initLocation(): void {
    const location$ = this._store.pipe(
      select(fromCurrentLocationSelectors.selectCurrentLocation),
      takeUntil(this._destroy$),
      filter((location: GeoPosition) => !!_get(location, 'coords.longitude') && !!_get(location, 'coords.latitude')),
      map((location: GeoPosition) => [location.coords.longitude, location.coords.latitude]),
      distinctUntilChanged((position1, position2) => {
        const point1: turfCoord = {
          type: 'Point',
          coordinates: [position1[0], position1[1]]
        };

        const point2: turfCoord = {
          type: 'Point',
          coordinates: [position2[0], position2[1]]
        };

        return distance(point1, point2) <= 0.1;
      })
    );

    this._locate$
      .pipe(
        takeUntil(this._destroy$),
        switchMap(locate => (locate ? location$.pipe(take(1)) : NEVER))
      )
      .subscribe((coords: Array<number>) => {
        this._address = 'my-location';
        this._location = coords;
        this._search();
      });

    this._locate$.next(true);
  }
}
