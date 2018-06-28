import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs-compat';
import * as turf from '@turf/turf';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/never';

import { GoogleMapsService } from '../../../shared';
import * as geoSearchActions from '../../../geosearch/store/actions';
import { selectCurrentLocation, selectTracking } from '../../../store';
import { IGeoPosition } from '../../../shared/services/background-geolocation-service';

import { SearchFiltersSelectors } from '../../../search-filters/store/selectors';
import * as searchFilterActions from '../../../search-filters/store/actions';

import * as BackgroundGeolocationActions from '../../../shared/services/background-geolocation-service/store/actions';

@Component({
  selector: 'gtcn-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  @ViewChild('search', {
    read: ElementRef
  })
  private _searchElementRef: ElementRef;

  private _input: HTMLElement;
  private _destroy$ = new Subject<boolean>();
  private _locate$ = new Subject<boolean>();

  @Input() public context: string;

  @Input() public placeholder: string;

  public radiusRange = 50;

  protected _radius = 50000;
  protected _location: GeoJSON.Position | null = null;
  protected _address = 'my-location';

  constructor(
    private _googleMapsService: GoogleMapsService,
    private _ngZone: NgZone,
    private _store: Store<any>,
    private _searchFiltersSelectors: SearchFiltersSelectors
  ) {}

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
    this._store.dispatch(new BackgroundGeolocationActions.EndTracking());
  }

  ngOnInit() {
    this._input = this._searchElementRef.nativeElement;

    if (!(this._input instanceof HTMLInputElement)) {
      let input = this._input.querySelector('input');

      if (input !== null) {
        this._input = input;
      }
    }

    if (this._input instanceof HTMLInputElement) {
      this._googleMapsService.autocomplete(this._input).then(autocomplete => {
        autocomplete.addListener('place_changed', () => {
          this._ngZone.run(() => {
            let place = autocomplete.getPlace();

            if (typeof place.geometry === 'undefined' || place.geometry === null) {
              return;
            }

            this._locate$.next(false);

            this._location = [place.geometry.location.lng(), place.geometry.location.lat()];
            this._address = place.formatted_address;
          });
        });
      });
    }

    this._store
      .select(selectTracking)
      .take(1)
      .subscribe(tracking => {
        if (tracking === false) {
          this._store.dispatch(new BackgroundGeolocationActions.StartTracking());
        }
      });

    let location$ = this._store
      .select(selectCurrentLocation)
      .takeUntil(this._destroy$)
      .filter((location: IGeoPosition) => !!_.get(location, 'coords.latitude') && !!_.get(location, 'coords.latitude'))
      .map((location: IGeoPosition) => <GeoJSON.Position>[location.coords.longitude, location.coords.latitude])
      .distinctUntilChanged((position1, position2) => {
        let point1: turf.Coord = {
          type: 'Point',
          coordinates: [position1[0], position1[1]]
        };

        let point2: turf.Coord = {
          type: 'Point',
          coordinates: [position2[0], position2[1]]
        };

        return turf.distance(point1, point2) <= 0.1;
      });

    this._locate$
      .takeUntil(this._destroy$)
      .switchMap(locate => {
        return locate ? location$.take(1) : Observable.never();
      })
      .subscribe((coords: number[]) => {
        this._address = 'my-location';
        this._location = coords;
        this._search();
      });

    this._locate$.next(true);

    this._store
      .select(this._searchFiltersSelectors.getFilter('radius'))
      .takeUntil(this._destroy$)
      .filter(radius => !!radius && this._radius !== radius)
      .subscribe(radius => {
        this._radius = radius;
        this._search();
      });
  }

  protected _search() {
    if (!this._location) {
      return;
    }

    if (this._address) {
      this._store.dispatch(
        new searchFilterActions.ChangeFilters({
          location: this._address
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

  public searchLocation() {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
    }

    this._locate$.next(false);
    this._search();
  }

  public requestLocation() {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
      this._location = null;
    }

    this._locate$.next(true);
  }

  public onRadiusChange(data: number) {
    this._radius = data * 1000;
    this._search();
  }
}
