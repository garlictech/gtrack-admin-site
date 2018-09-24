import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store, MemoizedSelector, select } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { State } from '../../../../store';
import { editedHikeProgramActions } from '../../../../store/actions';
import { HikeEditRoutePlannerSelectors, EditedHikeProgramSelectors } from '../../../../store/selectors';
import { ConfirmationService } from 'primeng/primeng';
import { ILocalizedItem, ITextualDescription, IHikeProgramStored } from 'subrepos/provider-client';
import { IFormDescriptor, SliderField } from 'subrepos/gtrack-common-web/forms';

@Component({
  selector: 'app-hike-edit-general-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditGeneralInfoComponent implements OnInit, OnDestroy, AfterViewInit {
  public hikeProgramData$: Observable<IHikeProgramStored>;
  public isRoundTrip$: Observable<boolean>;
  public remoteError$: Observable<any>;
  public formDataPath$ = of('editedHikeProgram.data');
  public generalInfoFormDescriptor: IFormDescriptor;
  public storeDataPath: string;
  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeEditRoutePlannerSelectors: HikeEditRoutePlannerSelectors,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _confirmationService: ConfirmationService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._initDescriptionFormConfig();

    // Selectors
    this.isRoundTrip$ = this._store
      .pipe(
        select(this._hikeEditRoutePlannerSelectors.getIsRoundTrip),
        takeUntil(this._destroy$)
      );

    this.hikeProgramData$ = this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getData),
        takeUntil(this._destroy$)
      );

    this.remoteError$ = this._store
      .pipe(
        select(this._editedHikeProgramSelectors.getError),
        takeUntil(this._destroy$)
      );

    this.isRoundTrip$
      .pipe(takeUntil(this._destroy$))
      .subscribe((isRoundTrip: boolean) => {
        this._store.dispatch(
          new editedHikeProgramActions.AddHikeProgramDetails(
            {
              isRoundTrip: isRoundTrip
            },
            false
          )
        );
      });
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  private _initDescriptionFormConfig() {
    this.descriptionSelector = this._editedHikeProgramSelectors.getDescriptions;
    this.storeDataPath = `${this._editedHikeProgramSelectors.dataPath}.description`;

    this.generalInfoFormDescriptor = {
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success'],
        submitFv: (formGroup: FormGroup) => {
          return this._store.dispatch(new editedHikeProgramActions.AddHikeProgramDetails(formGroup.value, true));
        }
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

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription(langKey, data));
  }

  public deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription(lang));
      }
    });
  }
}
