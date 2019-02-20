import { ConfirmationService } from 'primeng/api';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IFormDescriptor, SliderField } from 'subrepos/gtrack-common-web/forms';
import { IHikeProgramStored, ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MemoizedSelector, select, Store } from '@ngrx/store';

import { State } from '../../../../store';
import { editedHikeProgramActions } from '../../../../store/actions';
import * as editedHikeProgramSelectors from '../../../../store/selectors/edited-hike-program';
import * as hikeEditRoutePlannerSelectors from '../../../../store/selectors/hike-edit-route-planner';

@Component({
  selector: 'app-hike-edit-general-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy, AfterViewInit {
  hikeProgramData$: Observable<IHikeProgramStored>;
  isRoundTrip$: Observable<boolean>;
  remoteError$: Observable<any>;
  formDataPath$ = of('editedHikeProgram.data');
  generalInfoFormDescriptor: IFormDescriptor;
  descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  descriptionLangSelector: any;
  private readonly _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly _store: Store<State>,
    private readonly _confirmationService: ConfirmationService,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._initDescriptionFormConfig();

    // Selectors
    this.isRoundTrip$ = this._store.pipe(
      select(hikeEditRoutePlannerSelectors.getIsRoundTrip),
      takeUntil(this._destroy$)
    );

    this.hikeProgramData$ = this._store.pipe(
      select(editedHikeProgramSelectors.getData),
      takeUntil(this._destroy$)
    );

    this.remoteError$ = this._store.pipe(
      select(editedHikeProgramSelectors.getError),
      takeUntil(this._destroy$)
    );

    this.isRoundTrip$.pipe(takeUntil(this._destroy$)).subscribe((isRoundTrip: boolean) => {
      this._store.dispatch(
        new editedHikeProgramActions.AddHikeProgramDetails(
          {
            isRoundTrip
          },
          false
        )
      );
    });
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription(langKey, data));
  };

  deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription(lang));
      }
    });
  };

  private _initDescriptionFormConfig() {
    this.descriptionSelector = editedHikeProgramSelectors.getDescriptions;
    this.descriptionLangSelector = editedHikeProgramSelectors.getDescriptionByLang;

    this.generalInfoFormDescriptor = {
      formDataSelector: editedHikeProgramSelectors.getData,
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) =>
          this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(formGroup.value, true))
      },
      fields: {
        difficulty: new SliderField({
          label: 'form.difficulty',
          required: true,
          min: 0,
          max: 10
        })
      }
    };
  }
}
