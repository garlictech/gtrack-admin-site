import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../../../store';
import { EditedHikeProgramSelectors } from '../../../../store/selectors';
import { IHikeProgramStop, IPoiStored } from 'subrepos/provider-client';
import { PoiSelectors, IconService } from 'subrepos/gtrack-common-ngx';
import { LanguageService } from '../../../../shared/services';

@Component({
  selector: 'gt-hike-edit-outline',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditOutlineComponent implements OnInit, OnDestroy {
  public stops$: Observable<IHikeProgramStop[]>;
  public startIcon: string;
  public finishIcon: string;
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _editedHikeProgramSelectors: EditedHikeProgramSelectors,
    private _poiSelectors: PoiSelectors,
    private _iconService: IconService
  ) {
    this.startIcon = this._iconService.url('start');
    this.finishIcon = this._iconService.url('finish');
  }

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
