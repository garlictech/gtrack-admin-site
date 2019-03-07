import _keys from 'lodash-es/keys';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  selector: 'app-hike-edit-photos-table',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditPhotosTableComponent implements OnInit, OnDestroy {
  @Input() images$: Observable<Array<BackgroundImageData>>;
  @Input() backgroundOriginalUrls$: Observable<Array<string>>;
  @Input() clickActions: any;
  @Input() showMarkerColumn: boolean;
  @Input() onRouteCheck: boolean;
  @Input() distanceFrom: Array<number>; // Used in gTrackPoi bgImages!
  imageSelections: { [id: string]: boolean };
  imageMarkerSelections: { [id: string]: boolean };
  private readonly _destroy$: Subject<boolean>;

  constructor() {
    this.imageSelections = {};
    this.imageMarkerSelections = {};

    this._destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.backgroundOriginalUrls$.pipe(takeUntil(this._destroy$)).subscribe((backgroundOriginalUrls: Array<string>) => {
      this.imageSelections = {};
      backgroundOriginalUrls.forEach(url => {
        this.imageSelections[url] = true;
      });
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  toggleBackgroundImage(image: BackgroundImageData): void {
    if (!this.imageSelections[image.original.url]) {
      this.clickActions.remove(image.original.url);
    } else {
      this.clickActions.add(image);
    }
  }

  toggleImageMarker(image: BackgroundImageData): void {
    if (!this.imageMarkerSelections[image.original.url]) {
      this.clickActions.removeMarker(image);
    } else {
      this.clickActions.addMarker(image);
    }
  }

  invertMarkerSelection(): void {
    const _imageSelection = [];

    for (const imgUrl in this.imageMarkerSelections) {
      if (!!this.imageMarkerSelections[imgUrl]) {
        _imageSelection.push(imgUrl);
      }
    }

    this.images$.pipe(take(1)).subscribe((images: Array<BackgroundImageData>) => {
      const _imagesToAdd = images.filter(
        i => !_imageSelection.includes(i.original.url) && (i as any).onRoute === this.onRouteCheck
      );
      const _imagesToRemove = images.filter(
        i => _imageSelection.includes(i.original.url) && (i as any).onRoute === this.onRouteCheck
      );

      _imagesToAdd.forEach(i => (this.imageMarkerSelections[i.original.url] = true));
      _imagesToRemove.forEach(i => (this.imageMarkerSelections[i.original.url] = false));

      this.clickActions.addMarkers(_imagesToAdd);
      this.clickActions.removeMarkers(_imagesToRemove);
    });
  }
}
