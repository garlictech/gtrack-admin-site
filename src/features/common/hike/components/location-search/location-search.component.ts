import _get from 'lodash-es/get';
import { NEVER, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { GeoPosition } from '@bit/garlictech.angular-features.common.current-geolocation';
import * as currentLocationActions from '@bit/garlictech.angular-features.common.current-geolocation/store/actions';
import * as fromCurrentLocationSelectors from '@bit/garlictech.angular-features.common.current-geolocation/store/selectors';
import { GeoSearchActions } from '@bit/garlictech.angular-features.common.geosearch';
import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { SearchFilterActions } from '@bit/garlictech.angular-features.common.search-filters';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import distance from '@turf/distance';
import { Coord as turfCoord } from '@turf/helpers';

import { GoogleMapsService } from '@bit/garlictech.angular-features.common.google-maps';

@Component({
  selector: 'gtrack-common-location-search',
  template: ''
})
export class LocationSearchComponent implements OnDestroy, OnInit {
  @Input() context: string;

  @Input() placeholder: string;
  @Input() displaySidebar;

  @Output() readonly displaySidebarChange: EventEmitter<boolean>;
  @Output() readonly search: EventEmitter<GeoJSON.Position>;

  icon: IconDefinition;

  radiusRange: number;

  protected _radius: number;
  protected _location?: GeoJSON.Position;
  protected _address: string;
  @ViewChild('search', { read: ElementRef }) _searchElementRef: ElementRef;

  _input: HTMLElement;
  private readonly _destroy$: Subject<boolean>;
  private readonly _locate$: Subject<boolean>;

  constructor(
    private readonly _googleMapsService: GoogleMapsService,
    private readonly _ngZone: NgZone,
    private readonly _store: Store<any>
  ) {
    this.icon = faSearch;

    this.radiusRange = 50;

    this._radius = 50000;
    this._address = 'my-location';

    this._destroy$ = new Subject<boolean>();
    this._locate$ = new Subject<boolean>();
    this.displaySidebarChange = new EventEmitter();
    this.search = new EventEmitter<GeoJSON.Position>();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  ngOnInit(): void {
    this.displaySidebar = true;
    if (typeof this._searchElementRef.nativeElement !== 'undefined') {
      this._input = this._searchElementRef.nativeElement;

      if (!(this._input instanceof HTMLInputElement)) {
        const input = this._input.querySelector('input');

        if (input !== null) {
          this._input = input;
        }
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
              this.searchLocation();
            });
          });
        })
        .catch(() => undefined);
    }

    this._initLocation();
  }

  protected _search(): any {
    if (!this._location) {
      return undefined;
    }

    if (this._address) {
      this._store.dispatch(
        new SearchFilterActions.ChangeFilters({
          location: this._address,
          center: this._location
        })
      );
    }

    this._store.dispatch(
      new GeoSearchActions.SearchInCircle(
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
    this.search.emit(this._location);
    this.displaySidebar = false;
    this.displaySidebarChange.emit(this.displaySidebar);
  }

  requestLocation(): void {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
      this._location = undefined;
    }

    this._store.dispatch(new currentLocationActions.StartBrowserPositioning());

    this._locate$.next(true);
    this.displaySidebar = false;
    this.displaySidebarChange.emit(this.displaySidebar);
  }

  onRadiusChange(data: number): void {
    this._radius = data * 1000;
    this._search();
  }
  redirectToSearch(position: GeoJSON.Position): void {
    this._store.dispatch(
      new RouterActions.Go(['search'], {
        queryParams: {
          lat: position[1],
          lng: position[0]
        }
      })
    );
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
        switchMap(locate => (locate ? location$ : NEVER)),
        takeUntil(this._destroy$)
      )
      .subscribe((coords: Array<number>) => {
        this._address = 'my-location';
        this._location = coords;
        this.search.next(this._location);
      });
  }
}
