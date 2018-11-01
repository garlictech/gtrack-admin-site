import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { IBackgroundImageData } from 'subrepos/provider-client';

import _keys from 'lodash-es/keys';

@Component({
  selector: 'app-hike-edit-photos-table',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditPhotosTableComponent implements OnInit, OnDestroy {
  @Input() images$: Observable<IBackgroundImageData[]>;
  @Input() backgroundOriginalUrls$: Observable<string[]>;
  @Input() clickActions: any;
  @Input() showMarkerColumn: boolean;
  @Input() onRouteCheck: boolean;
  @Input() distanceFrom: number[] = null; // Used in gTrackPoi bgImages!
  public imageSelections: { [id: string]: boolean } = {};
  public imageMarkerSelections: { [id: string]: boolean } = {};
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.backgroundOriginalUrls$
      .pipe(takeUntil(this._destroy$))
      .subscribe((backgroundOriginalUrls: string[]) => {
        this.imageSelections = {};
        backgroundOriginalUrls.map(url => {
          this.imageSelections[url] = true;
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  public toggleBackgroundImage(image: IBackgroundImageData) {
    if (!this.imageSelections[image.original.url]) {
      this.clickActions.remove(image.original.url);
    } else {
      this.clickActions.add(image);
    }
  }

  public toggleImageMarker(image: IBackgroundImageData) {
    if (!this.imageMarkerSelections[image.original.url]) {
      this.clickActions.removeMarker(image);
    } else {
      this.clickActions.addMarker(image);
    }
  }

  public invertMarkerSelection() {
    const _imageSelection = [];

    for (const imgUrl in this.imageMarkerSelections) {
      if (!!this.imageMarkerSelections[imgUrl]) {
        _imageSelection.push(imgUrl);
      }
    }

    this.images$
      .pipe(take(1))
      .subscribe((images: IBackgroundImageData[]) => {
        const _imagesToAdd = images.filter(i => !_imageSelection.includes(i.original.url));
        const _imagesToRemove = images.filter(i => _imageSelection.includes(i.original.url));

        _imagesToAdd.map(i => this.imageMarkerSelections[i.original.url] = true);
        _imagesToRemove.map(i => this.imageMarkerSelections[i.original.url] = false);

        this.clickActions.addMarkers(_imagesToAdd);
        this.clickActions.removeMarkers(_imagesToRemove);
      });
  }
}
