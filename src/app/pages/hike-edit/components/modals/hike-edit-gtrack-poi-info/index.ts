import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  BackgroundImageData,
  EObjectState,
  LocalizedItem,
  PoiStored,
  TextualDescription
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { PoiSelectors } from '@features/common/poi';
import { MemoizedSelector, select, Store } from '@ngrx/store';

import { State } from '../../../../../store';
import { commonPoiActions, editedGTrackPoiActions } from '../../../../../store/actions';
import * as editedGTrackPoiSelectors from '../../../../../store/selectors/edited-gtrack-poi';

@Component({
  selector: 'app-hike-edit-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  @Input() poiId: string;
  @Input() closeModal: any;

  descriptionSelector: MemoizedSelector<object, LocalizedItem<TextualDescription>>;
  descriptionLangSelector: any;

  poiLoaded$: Observable<boolean>;
  isDirty$: Observable<boolean>;

  backgroundImageUrlSelector: MemoizedSelector<object, Array<string>>;
  backgroundImageSelector: MemoizedSelector<object, Array<BackgroundImageData>>;
  clickActions: any;

  gTrackPoi: PoiStored;

  // tslint:disable-next-line:no-property-initializers
  EObjectState = EObjectState;

  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _poiSelectors: PoiSelectors,
    private readonly _messageService: MessageService,
    private readonly _confirmationService: ConfirmationService
  ) {
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.descriptionSelector = editedGTrackPoiSelectors.getDescriptions;
    this.descriptionLangSelector = editedGTrackPoiSelectors.getDescriptionByLang;

    // Attributes for Photos component
    this.backgroundImageSelector = editedGTrackPoiSelectors.getBackgroundImages;
    this.backgroundImageUrlSelector = editedGTrackPoiSelectors.getBackgroundOriginalUrls();
    this.clickActions = {
      add: image => this._store.dispatch(new editedGTrackPoiActions.AddPoiBackgroundImage(image)),
      remove: url => this._store.dispatch(new editedGTrackPoiActions.RemovePoiBackgroundImage(url))
    };

    this.poiLoaded$ = this._store.pipe(
      select(editedGTrackPoiSelectors.getData),
      takeUntil(this._destroy$),
      map(data => !!data)
    );

    this._store
      .pipe(
        select(editedGTrackPoiSelectors.getData),
        takeUntil(this._destroy$)
      )
      .subscribe((gTrackPoi: PoiStored) => {
        this.gTrackPoi = gTrackPoi;
      });

    this.isDirty$ = this._store.pipe(
      select(editedGTrackPoiSelectors.getDirty),
      takeUntil(this._destroy$)
    );

    // Handling save success
    this._store
      .pipe(
        select(editedGTrackPoiSelectors.getWorking),
        takeUntil(this._destroy$),
        filter(working => working !== null),
        switchMap(() =>
          this._store.pipe(
            select(editedGTrackPoiSelectors.getWorking),
            takeUntil(this._destroy$)
          )
        ),
        filter(working => working === null),
        switchMap(() =>
          this._store.pipe(
            select(editedGTrackPoiSelectors.getError),
            take(1)
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe((error: any) => {
        if (error) {
          const msg: Array<string> = [];
          for (const idx in error) {
            if (error[idx]) {
              msg.push(`${idx}: ${error[idx]}`);
            }
          }

          this._messageService.add({
            severity: 'error',
            summary: 'Poi',
            detail: `Error:<br>${msg.join('<br>')}`,
            life: 8000
          });
        } else {
          this._messageService.add({
            severity: 'success',
            summary: 'Poi',
            detail: 'Success!'
          });
        }
      });

    this._store
      .pipe(
        select(this._poiSelectors.getPoi(this.poiId)),
        take(1)
      )
      .subscribe((poi: PoiStored) => this._store.dispatch(new editedGTrackPoiActions.LoadPoi(poi)));
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  savePoi(): void {
    // Save hikeProgram
    this._store.dispatch(new editedGTrackPoiActions.SavePoi());
  }

  deletePoi(poiId: string): void {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new commonPoiActions.DeletePoi(poiId));
        this.closeModal();
      }
    });
  }

  // tslint:disable-next-line:no-property-initializers
  submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedGTrackPoiActions.AddNewTranslatedPoiDescription(langKey, data));
  };

  // tslint:disable-next-line:no-property-initializers
  deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedGTrackPoiActions.DeleteTranslatedPoiDescription(lang));
      }
    });
  };
}
