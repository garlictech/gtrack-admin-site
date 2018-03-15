
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, commonPoiActions } from 'app/store';
import { HikeEditPoiSelectors } from 'app/store/selectors';
import { DESCRIPTION_LANGS } from 'app/app.constants';
import { IDynamicComponentModalConfig } from 'subrepos/gtrack-common-ngx';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, ITextualDescriptionItem, IGTrackPoi } from 'app/shared/interfaces';

import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-gtrack-poi-info',
  templateUrl: './hike-edit-gtrack-poi-info.component.html',
  styleUrls: ['./hike-edit-gtrack-poi-info.component.scss']
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  public modalConfig: IDynamicComponentModalConfig;
  public poiId: string;
  public gTrackPoi$: Observable<IGTrackPoi | undefined>;
  public existingLangKeys: string[] = [];
  public descriptionForm: FormGroup;
  public langs = DESCRIPTION_LANGS;
  public selLang = '';
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  public items = ['Pizza', 'Pasta', 'Parmesan'];

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _hikeEditPoiSelectors: HikeEditPoiSelectors
  ) {}

  ngOnInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.poiId = this.modalConfig.component.data.poiId;
      console.log('POI', this.poiId);
    }

    this.gTrackPoi$ = this._store.select(
      this._hikeEditPoiSelectors.getGTrackPoi(<string>this.poiId)
    );

    this._initFormSubscriptions();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public savePoi() {
    this.gTrackPoi$.take(1).subscribe((poi: IGTrackPoi) => {
      let _descriptions = {};
      for (let desc of this.descriptionForm.value.langs) {
        _descriptions[desc.id] = _.omit(desc, 'id');
      }

      this._store.dispatch(new commonPoiActions.SavePoi(_.merge(_.cloneDeep(poi), {
        description: _descriptions
      })));
    })
  }

  public addTranslation() {
    if (this.selLang) {
      // Add new lang field to the form. Form change will call a store update.
      const control = <FormArray>this.descriptionForm.controls.langs;
      control.push(this._createDescriptionItem(this.selLang, {}));

      // Clear lang selector guide
      this.selLang = '';
    }
  }

  private _initFormSubscriptions() {
    //
    // Descriptions
    //

    this.descriptionForm = this._formBuilder.group({
      langs: this._formBuilder.array([])
    });

    this.gTrackPoi$
      .takeUntil(this._destroy$)
      .subscribe((gTrackPoi: IGTrackPoi) => {
        console.log('POI SUBSCRIPTION');
        let _descriptionArray = <FormArray>this.descriptionForm.controls.langs;

        if (gTrackPoi.description) {
          this.existingLangKeys = Object.keys(gTrackPoi.description);
          for (let lang of Object.keys(gTrackPoi.description)) {
            let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(lang);

            // Insert new language
            if (_langIdx < 0) {
              const formArrayItem = this._createDescriptionItem(lang, gTrackPoi.description[lang]);
              _descriptionArray.push(formArrayItem);
            // Update existing language
            } else {
              console.log('patch', gTrackPoi, gTrackPoi.description[lang]);
              _descriptionArray.at(_langIdx).patchValue(gTrackPoi.description[lang]);
            }

          }
        }
      });
  }

  private _createDescriptionItem(lang, desc) {
    return this._formBuilder.group({
        id: lang,
        title: [desc.title || ''],
        fullDescription: [desc.fullDescription || ''],
        summary: [desc.summary || ''],
    });
  }

  public onTagsChanged($event) {
    console.log('onTagsChanged', $event);
  }
}
