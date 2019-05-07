import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormDescriptor, RangeSliderField, SliderField } from '@bit/garlictech.angular-features.common.forms';
import { select, Store } from '@ngrx/store';

import { SearchFilterActions, SearchFiltersSelectors } from '../../store';

@Component({
  selector: 'gtrack-common-search-filters',
  template: ''
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  formDescriptor: FormDescriptor;
  filterForm: FormGroup;

  @Output() readonly closeClick: EventEmitter<void>;

  private readonly _defaultFormConfig: any;
  private readonly _destroy$: Subject<boolean>;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _store: Store<any>,
    private readonly _searchFiltersSelectors: SearchFiltersSelectors
  ) {
    this._destroy$ = new Subject<boolean>();
    this.closeClick = new EventEmitter<void>();

    this._defaultFormConfig = {
      radius: 50,
      difficulty: [[1, 5]],
      length: [[0, 50]],
      time: [[0, 60]]
    };

    this.filterForm = this._fb.group(this._defaultFormConfig);
  }

  ngOnInit(): void {
    this.formDescriptor = {
      submit: { submitFv: (formGroup: FormGroup) => this.onChanges(formGroup.value) },
      fields: {
        radius: new SliderField({
          label: 'common.hike.location-search.max-distance',
          min: 1,
          max: 200,
          defaultValue: 50,
          submitOnChange: true
        }),
        difficulty: new RangeSliderField({
          label: 'common.hike.location-search.difficulty',
          min: 1,
          max: 5,
          defaultValue: [1, 5],
          submitOnChange: true
        }),
        length: new RangeSliderField({
          label: 'common.hike.location-search.distance',
          min: 1,
          max: 50,
          defaultValue: [5, 50],
          submitOnChange: true
        }),
        time: new RangeSliderField({
          label: 'common.hike.location-search.length',
          min: 0,
          max: 10,
          defaultValue: [3, 10],
          submitOnChange: true
        })
      }
    };

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this._destroy$)
      )
      .subscribe(value => this.onChanges(value));

    this._store
      .pipe(
        select(this._searchFiltersSelectors.getFilters),
        takeUntil(this._destroy$),
        filter(filters => !!filters)
      )
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

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  onChanges(value): void {
    this._store.dispatch(
      new SearchFilterActions.ChangeFilters({
        radius: value.radius * 1000,
        difficulty: [value.difficulty[0], value.difficulty[1]],
        length: [value.length[0] * 1000, value.length[1] * 1000],
        time: [value.time[0] * 60, value.time[1] * 60]
      })
    );
  }

  onClose(): void {
    this.closeClick.emit();
  }
}
