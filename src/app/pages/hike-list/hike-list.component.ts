import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { State } from '../../store';
import { commonHikeActions } from '../../store/actions';
import { IHikeProgramStored, EObjectState } from 'subrepos/provider-client';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';
import { SelectItem, ConfirmationService } from 'primeng/api';

import _orderBy from 'lodash-es/orderBy';

@Component({
  selector: 'app-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit, OnDestroy {
  public hikeList$: Observable<IHikeProgramStored[]>;
  public EObjectState = EObjectState;
  public selectedListState: EObjectState = EObjectState.published;
  public listStates: SelectItem[] = [];
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _store: Store<State>,
    private _hikeSelectors: HikeSelectors,
    private _title: Title,
    private _confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this._title.setTitle('Hikes');

    this.listStates = [
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' }
    ];

    this.hikeList$ = this._store.pipe(
      select(this._hikeSelectors.getActiveHikes()),
      takeUntil(this._destroy$),
      map(hikes => _orderBy(hikes, ['timestamp'], ['desc']))
    );

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public deleteHike(hikeId: string) {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new commonHikeActions.DeleteHikeProgram(hikeId));
      }
    });
  }
}
