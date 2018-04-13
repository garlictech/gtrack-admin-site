
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { State, commonPoiActions } from 'app/store';
import { HikeEditPoiSelectors } from 'app/store/selectors';
import { DESCRIPTION_LANGS } from 'app/app.constants';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, ITextualDescriptionItem, IGTrackPoi } from 'app/shared/interfaces';
import { DESCRIPTION_LANGUAGES, LanguageService } from 'app/shared/services';
import { IDynamicComponentModalConfig, PoiSelectors, Poi } from 'subrepos/gtrack-common-ngx';
import { IPoi } from 'subrepos/provider-client';

import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-gtrack-poi-info',
  templateUrl: './hike-edit-gtrack-poi-info.component.html',
  styleUrls: ['./hike-edit-gtrack-poi-info.component.scss']
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  public modalConfig: IDynamicComponentModalConfig;
  public poiId: string;
  public poiForm: FormGroup;
  public existingLangKeys: string[] = [];
  public langs = DESCRIPTION_LANGUAGES;
  private _gTrackPoi: IPoi;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _poiSelectors: PoiSelectors,
    private _toasterService: ToasterService,
  ) {}

  ngOnInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.poiId = this.modalConfig.component.data.poiId;

      // Poi data
      this._store.select(this._poiSelectors.getPoi(<string>this.poiId))
        .take(1)
        .subscribe((poi: Poi) => {
          this._gTrackPoi = _.cloneDeep(poi);
          this._initFormSubscriptions();
        });

      // Watch poi saved context
      this._store.select(this._poiSelectors.getPoiContext(<string>this.poiId))
        .filter(poiContext => !!(poiContext && poiContext.saved))
        .take(1)
        .subscribe(poiContext => {
          this._toasterService.pop('success', 'Success!', 'Poi saved!');
          this.modalConfig.modal.close();
        });
    }
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  private _initFormSubscriptions() {
    this.poiForm = this._formBuilder.group({
      _selLang: new FormControl('', []),
      tags: new FormControl('', []),
      langs: this._formBuilder.array([])
    });

    this.poiForm.valueChanges
      .takeUntil(this._destroy$)
      .subscribe((value) => {
        this.existingLangKeys = value.langs.map(lang => lang.id);
      })

    this.poiForm.controls.tags.setValue(this._gTrackPoi.tags || []);

    let _descriptionArray = <FormArray>this.poiForm.controls.langs;

    if (this._gTrackPoi.description) {
      for (let lang of Object.keys(this._gTrackPoi.description)) {
        let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(lang);

        // Insert new language
        if (_langIdx < 0) {
          const formArrayItem = this._createDescriptionItem(lang, this._gTrackPoi.description[lang]);
          _descriptionArray.push(formArrayItem);
        // Update existing language
        } else {
          _descriptionArray.at(_langIdx).patchValue(this._gTrackPoi.description[lang]);
        }
      }
    }
  }

  private _createDescriptionItem(lang, desc) {
    return this._formBuilder.group({
      id: lang,
      title: [desc.title || ''],
      fullDescription: [desc.fullDescription || ''],
      summary: [desc.summary || ''],
    });
  }

  public addTranslation() {
    if (this.poiForm.controls._selLang.value) {
      // Add new lang field to the form. Form change will call a store update.
      const _descriptionArray = <FormArray>this.poiForm.controls.langs;
      _descriptionArray.push(this._createDescriptionItem(this.poiForm.controls._selLang.value, {}));

      // Clear lang selector guide
      this.poiForm.controls._selLang.setValue('');
    }
  }

  public deleteTranslation(lang) {
    (<FormArray>this.poiForm.controls.langs).removeAt(
      (<FormArray>this.poiForm.controls.langs).value.findIndex(translation => translation.id === lang)
    );
  }

  public savePoi() {
    let _descriptions = {};

    for (let desc of this.poiForm.value.langs) {
      _descriptions[desc.id] = _.omit(desc, 'id');
    }

    // Clear descriptions before merge
    this._gTrackPoi.description = {};

    this._store.dispatch(new commonPoiActions.SavePoi(
      _.merge(this._gTrackPoi, {
        description: _descriptions,
        // We have to convert stored tag objects to single string array
        tags: this.poiForm.controls.tags.value.map(tag => tag.value)
      })
    ));
  }

  public getLangName(key) {
    return LanguageService.localeToName(key);
  }
}
