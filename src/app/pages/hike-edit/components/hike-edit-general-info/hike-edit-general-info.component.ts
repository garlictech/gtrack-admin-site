
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { State, hikeEditGeneralInfoActions } from 'app/store';
import { HikeEditGeneralInfoSelectors } from 'app/store/selectors';
import { ITextualDescriptionItem } from 'app/shared/interfaces';
import { ITextualDescription } from 'subrepos/provider-client';
import { IGeneralInfoState } from '../../../../store/state';

import * as _ from 'lodash';

// TODO: load from config?
const LANGS = {
  en_US: 'English',
  hu_HU: 'Hungarian',
  de_DE: 'German',
  fr_FR: 'French',
  it_IT: 'Italian'
};

@Component({
  selector: 'gt-hike-edit-general-info',
  templateUrl: './hike-edit-general-info.component.html',
  styleUrls: ['./hike-edit-general-info.component.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy {
  public textualDescriptions$: Observable<ITextualDescriptionItem[]>;
  public generalInfo$: Observable<IGeneralInfoState>;
  public existingLangKeys$: Observable<string[] | number[]>;
  public generalInfoForm: FormGroup;
  public descriptionForm: FormGroup;
  public langs = LANGS;
  public selLang = '';
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _formBuilder: FormBuilder,
    private _hikeEditGeneralInfoSelectors: HikeEditGeneralInfoSelectors,
  ) {
    this._store.dispatch(new hikeEditGeneralInfoActions.ResetGeneralInfoState());
  }

  ngOnInit() {
    // Selectors
    this.existingLangKeys$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllLangKeys
    );
    this.textualDescriptions$ = this._store.select(
      this._hikeEditGeneralInfoSelectors.getAllDescriptions
    );
    this.generalInfo$ = this._store.select(this._hikeEditGeneralInfoSelectors.getGeneralInfo);

    this._initFormSubscriptions();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public saveToStore() {
    this._store.dispatch(new hikeEditGeneralInfoActions.SetGeneralInfo({
      isRoundTrip: this.generalInfoForm.controls.isRoundTrip.value,
      difficulty: this.generalInfoForm.controls.difficulty.value
    }));

    this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
      descriptions: this.descriptionForm.value.langs
    }));
  }

  private _initFormSubscriptions() {
    //
    // General info
    //

    this.generalInfoForm = this._formBuilder.group({
      isRoundTrip: false,
      difficulty: 1
    });

    this.generalInfo$.subscribe((generalInfo) => {
      this.generalInfoForm.patchValue({
        isRoundTrip: generalInfo.isRoundTrip,
        difficulty: generalInfo.difficulty
      })
    });

    //
    // Descriptions
    //

    this.descriptionForm = this._formBuilder.group({
      langs: this._formBuilder.array([])
    });

    this.textualDescriptions$.subscribe((descriptions) => {
      let _descriptionArray = <FormArray>this.descriptionForm.controls.langs;

      for (let desc of descriptions) {
        let _langIdx = _.map(_descriptionArray.value, 'id').indexOf(desc.id);

        // Insert new language
        if (_langIdx < 0) {
          const formArrayItem = this._createDescriptionItem(desc);
          _descriptionArray.push(formArrayItem);
        // Update existing language
        } else {
          _descriptionArray.at(_langIdx).patchValue(desc);
        }
      }
    });
  }

  private _createDescriptionItem(desc) {
    return this._formBuilder.group({
        id: [desc.id || ''],
        title: [desc.title || ''],
        fullDescription: [desc.fullDescription || ''],
        summary: [desc.summary || ''],
    });
  }

  /*
  public removeTextualDescription(i: number) {
      const control = <FormArray>this.descriptionForm.controls.langs;
      control.removeAt(i);
  }
  */

  public addTranslation() {
    if (this.selLang) {
      // Add new lang field to the form. Form change will call a store update.
      const control = <FormArray>this.descriptionForm.controls.langs;
      control.push(this._createDescriptionItem({
        id: this.selLang
      }));

      // Clear lang selector guide
      this.selLang = '';
    }
  }
}
