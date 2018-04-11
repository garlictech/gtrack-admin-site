import { Component, NgZone, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { GoogleMapsService } from '../../../shared';
import * as geoSearchActions from '../../../geosearch/store/actions';
import * as userStatusActions from '../../../user-status/store/actions';
import { UserStatusSelectors } from '../../../user-status/store/selectors';

@Component({
  selector: 'gtcn-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
  @ViewChild('search', {
    read: ElementRef
  })
  private _searchElementRef: ElementRef;

  private _input: HTMLElement;

  @Input()
  public context: string;

  @Input()
  public placeholder: string;

  public radiusRange = 50;

  protected _radius = 50000;
  protected _location: GeoJSON.Position;

  constructor(
    private _googleMapsService: GoogleMapsService,
    private _ngZone: NgZone,
    private _store: Store<any>,
    private _userStatusSelectors: UserStatusSelectors
  ) {

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
      this._googleMapsService
        .autocomplete(this._input)
        .then(autocomplete => {
          autocomplete.addListener('place_changed', () => {
            this._ngZone.run(() => {
              let place = autocomplete.getPlace();

              if (typeof place.geometry === 'undefined' || place.geometry === null) {
                return;
              }

              this._location = [place.geometry.location.lng(), place.geometry.location.lat()];
              this._search();
            });
        });
      });
    }

    this._store
      .select(this._userStatusSelectors.getUserLocation)
      .subscribe(location => {
        this._location = location;
        this._search();
      });

    this._store.dispatch(new userStatusActions.RequestLocation());
  }

  protected _search() {
    if (!this._location) {
      return;
    }

    this._store.dispatch(new geoSearchActions.SearchInCircle({
      table: 'hike_programs',
      circle: {
        center: this._location,
        // TODO: get radius from input
        radius: this._radius
      }
    }, this.context));
  }

  public requestLocation() {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
    }

    this._store.dispatch(new userStatusActions.RequestLocation());
  }

  public onRadiusChange(data: number) {
    this._radius = data * 1000;
    this._search();
  }
}
