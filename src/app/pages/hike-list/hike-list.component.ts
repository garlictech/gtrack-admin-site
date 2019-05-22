import _orderBy from 'lodash-es/orderBy';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { HikeSelectors } from 'subrepos/gtrack-common-ngx';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EObjectState, HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { select, Store } from '@ngrx/store';

import { State } from '../../store';
import { commonHikeActions } from '../../store/actions';

@Component({
  selector: 'app-hike-list',
  templateUrl: './hike-list.component.html',
  styleUrls: ['./hike-list.component.scss']
})
export class HikeListComponent implements OnInit, OnDestroy {
  hikeList$: Observable<Array<HikeProgramStored>>;
  // tslint:disable-next-line:no-property-initializers
  EObjectState = EObjectState;
  selectedListState: EObjectState;
  listStates: Array<SelectItem>;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _store: Store<State>,
    private readonly _hikeSelectors: HikeSelectors,
    private readonly _title: Title,
    private readonly _confirmationService: ConfirmationService
  ) {
    this.selectedListState = EObjectState.published;
    this.listStates = [
      { label: 'Published', value: 'published' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' }
    ];
    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this._title.setTitle('Hikes');

    this.hikeList$ = this._store.pipe(
      select(this._hikeSelectors.getActiveHikes()),
      takeUntil(this._destroy$),
      map(hikes => _orderBy(hikes, ['timestamp'], ['desc']))
    );

    this._store.dispatch(new commonHikeActions.LoadHikePrograms());
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  deleteHike(hikeId: string): void {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this._store.dispatch(new commonHikeActions.DeleteHikeProgram(hikeId));
      }
    });
  }
}
