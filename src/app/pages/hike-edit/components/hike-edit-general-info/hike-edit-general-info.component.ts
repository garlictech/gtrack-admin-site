
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
  public existingLangKeys$: Observable<string[] | number[]>;
  public existingLangKeys: string[] | number[] = [];
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

    this._initDescriptionsForm();

    // Watch form changes and save values to store (w/ 1 sec delay)
    this.generalInfoForm.controls.isRoundTrip.valueChanges
      .takeUntil(this._destroy$)
      .debounceTime(1000)
      .subscribe((value) => {
        this._store.dispatch(new hikeEditGeneralInfoActions.SetIsRoundTrip({
          isRoundTrip: value
        }));
      });

    // Watch form changes and save values to store (w/ 1 sec delay)
    this.generalInfoForm.controls.difficulty.valueChanges
      .takeUntil(this._destroy$)
      .debounceTime(1000)
      .subscribe((value) => {
        this._store.dispatch(new hikeEditGeneralInfoActions.SetDifficulty({
          difficulty: value
        }));
      });

    // Watch form changes and save values to store (w/ 1 sec delay)
    this.descriptionForm.valueChanges
      .takeUntil(this._destroy$)
      .debounceTime(1000)
      .subscribe((value) => {
        this._store.dispatch(new hikeEditGeneralInfoActions.SetDescriptions({
          descriptions: value.langs
        }));
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  private _initDescriptionsForm() {
    // Initialize forms
    this.generalInfoForm = this._formBuilder.group({
      isRoundTrip: false,
      difficulty: 5
    });
    this.descriptionForm = this._formBuilder.group({
      langs: this._formBuilder.array([])
    });

    // Fill the form with state values
    this.textualDescriptions$
      .take(1)
      .subscribe((descriptions) => {
        const descriptionArray = <FormArray>this.descriptionForm.controls.langs;
        for (let desc of descriptions) {
          const formArrayItem = this._createDescriptionItem(desc);
          descriptionArray.push(formArrayItem);
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
