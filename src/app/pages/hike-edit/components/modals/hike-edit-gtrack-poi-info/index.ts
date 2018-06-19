import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store, MemoizedSelector } from '@ngrx/store';
import { State, commonPoiActions, editedGTrackPoiActions } from 'app/store';
import { IDynamicComponentModalConfig, PoiSelectors, Poi } from 'subrepos/gtrack-common-ngx';
import { IPoiStored, IPoi, ILocalizedItem, ITextualDescription, EObjectState, IBackgroundImageData } from 'subrepos/provider-client';
import { EditedGTrackPoiSelectors } from 'app/store/selectors';

import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'gt-hike-edit-gtrack-poi-info',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeEditGTrackPoiInfoComponent implements OnInit, OnDestroy {
  public static componentName = 'HikeEditGTrackPoiInfoComponent';
  public modalConfig: IDynamicComponentModalConfig;
  public poiId: string;

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
    private _formBuilder: FormBuilder,
    private _poiSelectors: PoiSelectors,
    private _editedGTrackPoiSelectors: EditedGTrackPoiSelectors,
    private _toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.descriptionSelector = this._editedGTrackPoiSelectors.getDescriptions;
    this.storeDataPath = `${this._editedGTrackPoiSelectors.dataPath}.description`;

    // Attributes for Photos component
    this.backgroundImageSelector = this._editedGTrackPoiSelectors.getBackgroundImages;
    console.log('this.backgroundImageSelector', this.backgroundImageSelector);
    this.backgroundImageUrlSelector = this._editedGTrackPoiSelectors.getBackgroundOriginalUrls();
    console.log('this.backgroundImageUrlSelector', this.backgroundImageUrlSelector);
    this.clickActions = {
      add: (image) => this._store.dispatch(new editedGTrackPoiActions.AddBackgroundImage(image)),
      remove: (url) => this._store.dispatch(new editedGTrackPoiActions.RemoveBackgroundImage(url))
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

    if (this.modalConfig && this.modalConfig.component.data) {
      this.poiId = this.modalConfig.component.data.poiId;

      this._store
        .select(this._poiSelectors.getPoi(<string>this.poiId))
        .take(1)
        .subscribe((poi: IPoiStored) => this._store.dispatch(new editedGTrackPoiActions.LoadPoi(poi)));
    }
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
    this._store.dispatch(new commonPoiActions.DeletePoi(poiId));
    this.modalConfig.modal.close();
  }

  public submitDescription = (langKey: string, data: any) => {
    this._store.dispatch(new editedGTrackPoiActions.AddNewTranslatedPoiDescription(langKey, data));
  };

  public deleteDescription = lang => {
    this._store.dispatch(new editedGTrackPoiActions.DeleteTranslatedPoiDescription(lang));
  };
}
