import { ChangeDetectorRef, Component, ElementRef, HostListener, Injector, OnDestroy, Type } from '@angular/core';
import { DestroyableComponent } from '@bit/garlictech.angular-features.common.utils';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { delay, filter, map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-infinite-scroll',
  template: ''
})
export class InfiniteScrollComponent extends DestroyableComponent implements OnDestroy {
  get totalRecords$(): Observable<number> {
    return this._totalRecords$;
  }

  get shouldShowComponent$(): Observable<boolean> {
    return this._isEnd$.pipe(map(isEnd => !isEnd));
  }

  itemsShown: Array<any>;

  sliceEmitter$: Subject<{ firstIndex: number; rows: number }>;

  protected _store: Store<any>;
  protected _cdr: ChangeDetectorRef;
  protected _element: ElementRef;

  private _lastKeySelector;
  private _items$: Observable<Array<any>>;

  private _isEnd$: Observable<boolean>;
  private _itemFetcher;
  private _totalRecords$: Observable<number>;
  private readonly _defaults: { firstIndex: number; rows: number };

  constructor(private readonly _injector: Injector) {
    super();
    this.sliceEmitter$ = new Subject<any>();
    this._store = this._injector.get<Store<any>>(Store);
    this._cdr = this._injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
    this._element = this._injector.get<ElementRef>(ElementRef);
    this._isEnd$ = of(false);
    this._totalRecords$ = of(0);
    this._defaults = { firstIndex: 0, rows: 10 };
    this.itemsShown = [];
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  initialize(lastKeySelector, items$, itemFetcher): void {
    this._lastKeySelector = lastKeySelector;
    this._itemFetcher = itemFetcher;

    this._items$ = items$;
    this._totalRecords$ = this._items$.pipe(map(items => (Array.isArray(items) ? items.length : 0)));

    this._isEnd$ = this._store.pipe(
      select(this._lastKeySelector),
      map(key => !key)
    );

    combineLatest(this._items$, this.sliceEmitter$)
      .pipe(
        filter(([items, indexes]) => _.isArray(items) && !!indexes),
        map(([items]) => items),
        takeUntil(this._destroy$)
      )
      .subscribe(items => (this.itemsShown = items));

    this._items$
      .pipe(delay(0)) // Wait for template rendering, before call _checkScrollPosition
      .subscribe(() => this._checkScrollPosition());

    this.sliceEmitter$.next(this._defaults);
    this._cdr.detectChanges();
  }

  reset(): void {
    this.sliceEmitter$.next(this._defaults);
  }

  loadMore(): void {
    this._store
      .pipe(
        select(this._lastKeySelector),
        take(1),
        filter(lastKey => !!lastKey)
      )
      .subscribe(lastKey => {
        this._itemFetcher(lastKey);
      });

    this._totalRecords$.pipe(take(1)).subscribe(totalRecords => {
      this.sliceEmitter$.next({ firstIndex: totalRecords, rows: 10 });
    });
  }

  @HostListener('scroll') onScroll(): void {
    this._checkScrollPosition();
  }

  /**
   * _checkScrollPosition calculates component's scrollTop
   *   if it reached the bottom of scrollable content then trigger loadMore to fetch more items
   */
  private _checkScrollPosition(): void {
    const pxFromBottom = 100; // range from bottom where loadMore triggered, so fetching starts before user reach list end
    const {
      scrollHeight,
      offsetHeight,
      scrollTop
    }: { scrollHeight: number; offsetHeight: number; scrollTop: number } = this._element.nativeElement;

    if (scrollHeight !== 0 && scrollHeight - pxFromBottom < offsetHeight + Math.round(scrollTop)) {
      this.loadMore();
    }
  }
}
