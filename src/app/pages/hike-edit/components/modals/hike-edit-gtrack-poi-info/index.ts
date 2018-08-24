import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, MemoizedSelector } from '@ngrx/store';
import { State, commonPoiActions, editedGTrackPoiActions } from '../../../../../store';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { IPoiStored, ILocalizedItem, ITextualDescription, EObjectState, IBackgroundImageData } from 'subrepos/provider-client';
import { EditedGTrackPoiSelectors } from '../../../../../store/selectors';

import { ToasterService } from 'angular2-toaster';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'gt-hike-edit-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  @Input() poiId: string;
  @Input() closeModal: any;

  public storeDataPath: string;
  public descriptionSelector: MemoizedSelector<object, ILocalizedItem<ITextualDescription>>;

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
    private _toasterService: ToasterService,
    private _confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.descriptionSelector = this._editedGTrackPoiSelectors.getDescriptions;
    this.storeDataPath = `${this._editedGTrackPoiSelectors.dataPath}.description`;

    // Attributes for Photos component
    this.backgroundImageSelector = this._editedGTrackPoiSelectors.getBackgroundImages;
    this.backgroundImageUrlSelector = this._editedGTrackPoiSelectors.getBackgroundOriginalUrls();
    this.clickActions = {
      add: (image) => this._store.dispatch(new editedGTrackPoiActions.AddPoiBackgroundImage(image)),
      remove: (url) => this._store.dispatch(new editedGTrackPoiActions.RemovePoiBackgroundImage(url))
    }

    this.poiLoaded$ = this._store
      .select(this._editedGTrackPoiSelectors.getData)
      .takeUntil(this._destroy$)
      .map(data => !!data);

    this._store
      .select(this._editedGTrackPoiSelectors.getData)
      .takeUntil(this._destroy$)
      .subscribe((gTrackPoi: IPoiStored) => {
        this.gTrackPoi = gTrackPoi;
      });

    this.isDirty$ = this._store.select(this._editedGTrackPoiSelectors.getDirty).takeUntil(this._destroy$);

    // Handling save success
    this._store
      .select(this._editedGTrackPoiSelectors.getWorking)
      .takeUntil(this._destroy$)
      .filter(working => working !== null)
      .switchMap(() => this._store.select(this._editedGTrackPoiSelectors.getWorking).takeUntil(this._destroy$))
      .filter(working => working === null)
      .switchMap(() => this._store.select(this._editedGTrackPoiSelectors.getError).take(1))
      .takeUntil(this._destroy$)
      .subscribe(error => {
        if (error) {
          let msg: string[] = [];
          for (let idx in error) {
            msg.push(`${idx}: ${error[idx]}`);
          }

          this._toasterService.pop({
            type: 'error',
            title: 'Poi',
            body: `Error:<br>${msg.join('<br>')}`,
            timeout: 8000
          });
        } else {
          this._toasterService.pop('success', 'Poi', 'Success!');
        }
      });

    this._store
      .select(this._poiSelectors.getPoi(<string>this.poiId))
      .take(1)
      .subscribe((poi: IPoiStored) => this._store.dispatch(new editedGTrackPoiActions.LoadPoi(poi)));
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
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
  };

  public deleteDescription = lang => {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new editedGTrackPoiActions.DeleteTranslatedPoiDescription(lang));
      }
    });
  };
}
