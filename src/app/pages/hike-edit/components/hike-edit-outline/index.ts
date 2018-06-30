import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import { EditedHikeProgramSelectors } from 'app/store/selectors';
import { IHikeProgramStop, IPoiStored } from 'subrepos/provider-client';
import { PoiSelectors } from 'subrepos/gtrack-common-ngx';
import { LanguageService } from 'app/shared/services';

@Component({
  selector: 'gt-hike-edit-outline',
  templateUrl: './ui.html'
})
export class HikeEditOutlineComponent implements OnInit, OnDestroy {
  public stops$: Observable<IHikeProgramStop[]>;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _poiSelectors: PoiSelectors
  ) {}

  ngOnInit() {
    this.stops$ = this._store
      .select(this._editedHikeProgramSelectors.getStopsWithPoiNames<IPoiStored>(this._poiSelectors.getAllPois))
      .takeUntil(this._destroy$);
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public translateDescription(description, field) {
    return LanguageService.translateDescription(description, field);
  }
}
