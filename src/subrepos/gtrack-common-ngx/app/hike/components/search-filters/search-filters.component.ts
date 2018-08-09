import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import * as filterActions from '../../../search-filters/store/actions';

import { SearchFiltersSelectors } from '../../../search-filters/store';

@Component({
  selector: 'gtcn-search-filters',
  template: ''
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public showFilters = false;

  private _defaultFormConfig = {
    radius: 50,
    difficulty: [[0, 10]],
    length: [[0, 50]],
    time: [[0, 60]]
  };

  private _destroy$ = new Subject<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _store: Store<any>,
    private _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this.filterForm = this._fb.group(this._defaultFormConfig);
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .debounceTime(300)
      .takeUntil(this._destroy$)
      .subscribe(value => this.onChanges(value));

    this._store
      .select(this._searchFiltersSelectors.getFilters)
      .takeUntil(this._destroy$)
      .filter(filters => !!filters)
      .subscribe(filters => {
        this.filterForm.setValue(
          {
            radius: Math.floor(filters.radius / 1000),
            difficulty: [filters.difficulty[0], filters.difficulty[1]],
            length: [Math.floor(filters.length[0] / 1000), Math.floor(filters.length[1] / 1000)],
            time: [Math.floor(filters.time[0] / 60), Math.floor(filters.time[1] / 60)]
          },
          {
            emitEvent: false
          }
        );
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  onChanges(value) {
    this._store.dispatch(
      new filterActions.ChangeFilters({
        radius: value.radius * 1000,
        difficulty: [value.difficulty[0], value.difficulty[1]],
        length: [value.length[0] * 1000, value.length[1] * 1000],
        time: [value.time[0] * 60, value.time[1] * 60]
      })
    );
  }

  public toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
