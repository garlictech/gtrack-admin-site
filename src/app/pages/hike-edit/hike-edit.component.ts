import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { State, GtActions } from '../../store';
import { HikeDataService } from '../../shared/services';
import { WaypointMarkerService } from '../../shared/services';
import { IMockHikeElement } from '../../shared/interfaces';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMouseEvent } from 'leaflet';
import {
  Map,
  LeafletComponent,
  Center
} from '../../../subrepos/gtrack-common-ngx';

declare const $: any;

const CENTER = <Center>{
  lat: 47.503136,
  lng: 19.06166,
  zoom: 17
};

const LAYERS = [{
  name: 'street',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}, {
  name: 'topo',
  url: 'https://opentopomap.org/{z}/{x}/{y}.png'
}];

const OVERLAYS = [{
  name: 'trails',
  url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
}];

// TODO: load from config?
const LANGS = {
  en_US: 'English (US)',
  hu_HU: 'Hungarian',
  de_DE: 'German',
  fr_FR: 'French',
  it_IT: 'Italian'
};

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map')
  map: Map;

  private _routeSubscription: Subscription;
  private _mode = 'routing';
  public hikeData: IMockHikeElement = null;
  public existingLangKeys: Set<string>;
  public center: Center = CENTER;
  public layers = LAYERS;
  public overlays = OVERLAYS;
  public langs = LANGS;
  public selLang: string = null;

  constructor(
    private _store: Store<State>,
    private _activatedRoute: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _waypointMarkerService: WaypointMarkerService,
    private _title: Title
  ) {}

  ngOnInit() {
    this._initHike();

    $.material.options.autofill = true;
    $.material.init();
  }

  ngAfterViewInit() {
    this.map.leafletMap.on('click', (e: LeafletMouseEvent) => {
      if (this._mode === 'routing') {
        console.log('Routing mode click', e.latlng);
        
        this._waypointMarkerService.addWaypoint(e.latlng);
      } else {
        // this._createCheckpoint(e.latlng);
      }
    });
  }

  ngOnDestroy() {
    if (this._routeSubscription) {
      this._routeSubscription.unsubscribe();
    }
  }

  private _initHike() {
    this._routeSubscription = this._activatedRoute.params.subscribe(params => {
      // Load hike data from mock DB
      if (params && params.id) {
        this._title.setTitle('Edit hike');

        this.hikeData = this._hikeDataService.getHike(params.id);

        // Get filled lang keys
        this.existingLangKeys = new Set([
          ...Object.keys(this.hikeData.title),
          ...Object.keys(this.hikeData.description)
        ]);
      // Create new hike
      } else {
        this._title.setTitle('New hike');

        this.hikeData = {
          title: {},
          description: {},
          summary: {}
        };

        this.existingLangKeys = new Set([]);
      }
    });
  }

  addTranslation() {
    if (this.selLang) {
      this.hikeData.title[this.selLang] = '';
      this.hikeData.description[this.selLang] = '';
      this.hikeData.summary[this.selLang] = '';

      this.existingLangKeys.add(this.selLang);

      this.selLang = null;
    }
  }

  save() {
    this._store.dispatch(new GtActions.SaveHikeAction(this.hikeData));
  }
}
