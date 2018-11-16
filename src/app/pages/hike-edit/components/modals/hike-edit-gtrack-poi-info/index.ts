import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, filter, switchMap, take } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Store, MemoizedSelector, select } from '@ngrx/store';
import { State } from '../../../../../store';
import { commonPoiActions, editedGTrackPoiActions } from '../../../../../store/actions';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import {
  IPoiStored,
  ILocalizedItem,
  ITextualDescription,
  EObjectState,
  IBackgroundImageData
} from 'subrepos/provider-client';
import { EditedGTrackPoiSelectors } from '../../../../../store/selectors';

@Component({
  selector: 'app-hike-edit-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  @Input() poiId: string;
  @Input() closeModal: any;

  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;
  public descriptionLangSelector: any;

  public poiLoaded$: Observable<boolean>;
  public isDirty$: Observable<boolean>;

  public backgroundImageUrlSelector: MemoizedSelector<object, string[]>;
  public backgroundImageSelector: MemoizedSelector<object, IBackgroundImageData[]>;
  public clickActions: any;

  public gTrackPoi: IPoiStored;
  public EObjectState = EObjectState;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _poiSelectors: PoiSelectors,
    private _editedGTrackPoiSelectors: EditedGTrackPoiSelectors,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.descriptionSelector = this._editedGTrackPoiSelectors.getDescriptions;
    this.descriptionLangSelector = this._editedGTrackPoiSelectors.getDescriptionByLang;

    // Attributes for Photos component
    this.backgroundImageSelector = this._editedGTrackPoiSelectors.getBackgroundImages;
    this.backgroundImageUrlSelector = this._editedGTrackPoiSelectors.getBackgroundOriginalUrls();
    this.clickActions = {
      add: image => this._store.dispatch(new editedGTrackPoiActions.AddPoiBackgroundImage(image)),
      remove: url => this._store.dispatch(new editedGTrackPoiActions.RemovePoiBackgroundImage(url))
    };

    this.poiLoaded$ = this._store.pipe(
      select(this._editedGTrackPoiSelectors.getData),
      takeUntil(this._destroy$),
      map(data => !!data)
    );

    this._store
      .pipe(
        select(this._editedGTrackPoiSelectors.getData),
        takeUntil(this._destroy$)
      )
      .subscribe((gTrackPoi: IPoiStored) => {
        this.gTrackPoi = gTrackPoi;
      });

    this.isDirty$ = this._store.pipe(
      select(this._editedGTrackPoiSelectors.getDirty),
      takeUntil(this._destroy$)
    );

    // Handling save success
    this._store
      .pipe(
        select(this._editedGTrackPoiSelectors.getWorking),
        takeUntil(this._destroy$),
        filter(working => working !== null),
        switchMap(() =>
          this._store.pipe(
            select(this._editedGTrackPoiSelectors.getWorking),
            takeUntil(this._destroy$)
          )
        ),
        filter(working => working === null),
        switchMap(() =>
          this._store.pipe(
            select(this._editedGTrackPoiSelectors.getError),
            take(1)
          )
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(error => {
        if (error) {
          const msg: string[] = [];
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
        select(this._poiSelectors.getPoi(<string>this.poiId)),
        take(1)
      )
      .subscribe((poi: IPoiStored) => this._store.dispatch(new editedGTrackPoiActions.LoadPoi(poi)));
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public savePoi() {
    // Save hikeProgram
    this._store.dispatch(new editedGTrackPoiActions.SavePoi());
  }

  public deletePoi(poiId: string) {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new commonPoiActions.DeletePoi(poiId));
        this.closeModal();
      }
    });
  }

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedGTrackPoiActions.AddNewTranslatedPoiDescription(langKey, data));
  }

  public deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedGTrackPoiActions.DeleteTranslatedPoiDescription(lang));
      }
    });
  }
}
