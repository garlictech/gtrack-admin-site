import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { State, GtActions } from '../../store';
import { ActivatedRoute } from '@angular/router';
import { HikeDataService } from '../../shared/services';
import { IHikeElement } from '../../shared/interfaces';
import { Subscription } from 'rxjs/Subscription';

declare const $: any;

@Component({
  selector: 'gt-hike-edit',
  templateUrl: './hike-edit.component.html',
  styleUrls: ['./hike-edit.component.scss']
})
export class HikeEditComponent implements OnInit, OnDestroy {
  private _routeSubscription: Subscription;
  hikeData: IHikeElement;
  existingLangKeys: Set<string>;
  // TODO langs from config????
  langs = {
    'en_US': 'English (US)',
    'hu_HU': 'Hungarian',
    'de_DE': 'German',
    'fr_FR': 'French',
    'it_IT': 'Italian',
  };
  selLang: string = null;

  constructor(
    private _store: Store<State>,
    private _route: ActivatedRoute,
    private _hikeDataService: HikeDataService,
    private _title: Title
  ) {
  }

  ngOnInit() {
    this.hikeData = {
      title: {},
      description: {},
      summary: {}
    };
    this.existingLangKeys = new Set([]);

    this._routeSubscription = this._route.params.subscribe(params => {
      // Load hike data from DB
      if (params && params.id) {
          this._title.setTitle('Edit hike');

          this.hikeData = this._hikeDataService.getHike(params.id);
          this.hikeData = this._hikeDataService.getHike(params.id);

          // Get filled lang keys
          this.existingLangKeys = new Set([
            ...Object.keys(this.hikeData.title),
            ...Object.keys(this.hikeData.description)
          ]);
      // Create new hike
      } else {
        this._title.setTitle('New hike');

        this.existingLangKeys = new Set([]);
      }
    });

    $.material.options.autofill = true;
    $.material.init();
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
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
