import { Subject } from 'rxjs';
import { HikeProgram } from '../../lib/hike-program';
import { SearchResultsMapComponent } from '../search-results-map/search-results-map.component';

import { AfterViewInit, Component, HostListener, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

import { RouterActions } from '@bit/garlictech.angular-features.common.router';
import { Store } from '@ngrx/store';
import _get from 'lodash-es/get';

@Component({
  selector: 'gtrack-common-hike-list',
  template: ''
})
export class HikeListComponent implements AfterViewInit, OnDestroy {
  @ViewChild(SearchResultsMapComponent) searchResultsMap: SearchResultsMapComponent;

  @Input() hikes: Array<HikeProgram>;
  @Input() preListTemplate: TemplateRef<any>;
  @Input() searchCircle: {
    lat: number;
    lng: number;
    radius: number;
  };

  showMap: boolean;
  activeView: string;
  activeHike?: HikeProgram;
  isMobile: boolean;
  mapButtonTitle: string;

  private readonly _destroy$: Subject<boolean>;

  @HostListener('window:resize', ['$event']) onResize(event): void {
    const width = event.target.innerWidth;

    this.isMobile = width < 768;
  }

  constructor(private readonly _store: Store<any>) {
    this.showMap = false;
    this.mapButtonTitle = 'Show map';
    this.isMobile = window.innerWidth < 768;
    this._destroy$ = new Subject<boolean>();
    this.activeView = 'map';
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.isMobile = window.innerWidth < 768;
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    this.showMap ? (this.mapButtonTitle = 'Hide map') : (this.mapButtonTitle = 'Show map');
  }

  changeView(view: string): void {
    this.activeView = view;
  }

  onHikeClick(hikeProgram: HikeProgram): void {
    this._store.dispatch(new RouterActions.Go(['hike', hikeProgram.id]));
  }

  onHikeHover(hikeProgram: HikeProgram): void {
    this.activeHike = hikeProgram;
  }

  onHikeLeave(): void {
    this.activeHike = undefined;
  }

  trackByFn(index: number): number {
    return index;
  }
}
