import { Component, AfterViewInit, OnDestroy, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store, createSelector, MemoizedSelector } from '@ngrx/store';
import { State, commonPoiActions, editedGTrackPoiActions } from 'app/store';
import { HikeEditPoiSelectors } from 'app/store/selectors';
import { DESCRIPTION_LANGS } from 'app/app.constants';
import { IWikipediaPoi, IGooglePoi, IOsmPoi, ITextualDescriptionItem, IGTrackPoi } from 'app/shared/interfaces';
import { DESCRIPTION_LANGUAGES, LanguageService } from 'app/shared/services';
import { IDynamicComponentModalConfig, PoiSelectors, Poi } from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';
import { EditedGTrackPoiSelectors } from 'app/store/selectors';

import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';

@Component({
  selector: 'gt-hike-edit-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeEditGTrackPoiInfoComponent implements AfterViewInit, OnDestroy, OnInit {
  public modalConfig: IDynamicComponentModalConfig;
  public poiId: string;

  public storeDataPath: string;
  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;

  public poiLoaded$: Observable<boolean>;
  public isDirty$: Observable<boolean>;

  private _gTrackPoi: IPoiStored;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _poiSelectors: PoiSelectors,
    private _editedGTrackPoiSelectors: EditedGTrackPoiSelectors,
    private _toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.descriptionSelector = this._editedGTrackPoiSelectors.getDescriptions;
    this.storeDataPath = `${this._editedGTrackPoiSelectors.dataPath}.description`;

    this.poiLoaded$ = this._store
      .select(this._editedGTrackPoiSelectors.getData)
      .map(data => !!data);

    this.isDirty$ = this._store
      .select(this._editedGTrackPoiSelectors.getDirty)
      .takeUntil(this._destroy$);
  }

  ngAfterViewInit() {
    if (this.modalConfig && this.modalConfig.component.data) {
      this.poiId = this.modalConfig.component.data.poiId;

      this._store
        .select(this._poiSelectors.getPoi(<string>this.poiId))
        .take(1)
        .subscribe((poi: IPoiStored) => this._store.dispatch(new editedGTrackPoiActions.LoadPoi(poi)));

      // // Poi data
      // this._store
      //   .select(this._poiSelectors.getPoi(<string>this.poiId))
      //   .take(1)
      //   .subscribe((poi: Poi) => {
      //     this._gTrackPoi = _.cloneDeep(poi);
      //     console.log('this._gTrackPoi', this._gTrackPoi);
      //     this._initFormSubscriptions();
      //   });

      // // Watch poi saved context
      // this._store
      //   .select(this._poiSelectors.getPoiContext(<string>this.poiId))
      //   .filter(poiContext => !!(poiContext && poiContext.saved))
      //   .take(1)
      //   .subscribe(poiContext => {
      //     this._toasterService.pop('success', 'Success!', 'Poi saved!');
      //     this.modalConfig.modal.close();
      //   });
    }

    // this.submitDescription = (langKey: string, data: any) => {
    //   this._store.dispatch(new EditedGtrackPoiActions.AddNewTranslatedDescription(langKey, data));
    // };

    // this.deleteDescription = lang => {
    //   this._store.dispatch(new EditedGtrackPoiActions.DeleteTranslatedDescription(lang));
    // };
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  // private _initFormSubscriptions() {
  //   this.poiForm = this._formBuilder.group({
  //     _selLang: new FormControl('', []),
  //     tags: new FormControl('', []),
  //     langs: this._formBuilder.array([])
  //   });

  //   this.poiForm.valueChanges.takeUntil(this._destroy$).subscribe(value => {
  //     this.existingLangKeys = value.langs.map(lang => lang.id);
  //   });

  //   this.poiForm.controls.tags.setValue(this._gTrackPoi.tags || []);

  //   let _descriptionArray = <FormArray>this.poiForm.controls.langs;

  //   if (this._gTrackPoi.description) {
  //     for (let lang of Object.keys(this._gTrackPoi.description)) {
  //       let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(lang);

  //       // Insert new language
  //       if (_langIdx < 0) {
  //         const formArrayItem = this._createDescriptionItem(lang, this._gTrackPoi.description[lang]);
  //         _descriptionArray.push(formArrayItem);
  //         // Update existing language
  //       } else {
  //         _descriptionArray.at(_langIdx).patchValue(this._gTrackPoi.description[lang]);
  //       }
  //     }
  //   }
  // }

  // private _createDescriptionItem(lang, desc) {
  //   return this._formBuilder.group({
  //     id: lang,
  //     title: [desc.title || ''],
  //     fullDescription: [desc.fullDescription || ''],
  //     summary: [desc.summary || '']
  //   });
  // }

  // public addTranslation() {
  //   if (this.poiForm.controls._selLang.value) {
  //     // Add new lang field to the form. Form change will call a store update.
  //     const _descriptionArray = <FormArray>this.poiForm.controls.langs;
  //     _descriptionArray.push(this._createDescriptionItem(this.poiForm.controls._selLang.value, {}));

  //     // Clear lang selector guide
  //     this.poiForm.controls._selLang.setValue('');
  //   }
  // }

  // public deleteTranslation(lang) {
  //   (<FormArray>this.poiForm.controls.langs).removeAt(
  //     (<FormArray>this.poiForm.controls.langs).value.findIndex(translation => translation.id === lang)
  //   );
  // }

  public savePoi() {
    this._store
      .select(this._editedGTrackPoiSelectors.getData)
      .filter(data => !!data)
      .take(1)
      .subscribe((data: IPoi) => this._store.dispatch(new commonPoiActions.SavePoi(data)));
  }

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedGTrackPoiActions.AddNewTranslatedPoiDescription(langKey, data));
  };

  public deleteDescription = (lang) => {
    this._store.dispatch(new editedGTrackPoiActions.DeleteTranslatedPoiDescription(lang));
  };
}
