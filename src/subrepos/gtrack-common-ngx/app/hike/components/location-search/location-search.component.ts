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
  @ViewChild('search')
  private _searchElementRef: ElementRef;

  @Input()
  public context: string;

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
    this._googleMapsService
      .autocomplete(this._searchElementRef)
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
    this._searchElementRef.nativeElement.value = '';
    this._store.dispatch(new userStatusActions.RequestLocation());
  }

  public onRadiusChange(data: number) {
    this._radius = data * 1000;
    this._search();
  }
}
