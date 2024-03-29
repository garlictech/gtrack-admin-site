import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  EHikeProgramDifficulty,
  HikeProgramStored,
  LocalizedItem,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  hikeProgramData$: Observable<HikeProgramStored>;
  isRoundTrip$: Observable<boolean>;
  remoteError$: Observable<any>;
  formDataPath$: Observable<string>;
  descriptionSelector: MemoizedSelector<object, LocalizedItem<TextualDescription>>;
  descriptionLangSelector: any;
  difficultyStates: Array<SelectItem>;

  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _confirmationService: ConfirmationService,
    private readonly _changeDetectorRef: ChangeDetectorRef
  ) {
    this.formDataPath$ = of('editedHikeProgram.data');

    this.difficultyStates = [
      { label: 'Easy', value: EHikeProgramDifficulty.easy },
      { label: 'Normal', value: EHikeProgramDifficulty.normal },
      { label: 'Hard', value: EHikeProgramDifficulty.hard }
    ];

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
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
      this._store.dispatch(new editedHikeProgramActions.SetHikeProgramIsRoundTrip(isRoundTrip));
    });
  }

  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  // tslint:disable-next-line:no-property-initializers
  submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedHikeProgramActions.AddNewTranslatedHikeProgramDescription(langKey, data));
  };

  // tslint:disable-next-line:no-property-initializers
  deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedHikeProgramActions.DeleteTranslatedHikeProgramDescription(lang));
      }
    });
  };

  difficultyChange($event: any): void {
    this._store.dispatch(new editedHikeProgramActions.SetHikeProgramDifficulty($event.value));
  }

  private _initDescriptionFormConfig(): void {
    this.descriptionSelector = editedHikeProgramSelectors.getDescriptions;
    this.descriptionLangSelector = editedHikeProgramSelectors.getDescriptionByLang;
  }
}
