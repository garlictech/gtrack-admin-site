import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'app-hike-edit-photos-table',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditPhotosTableComponent implements OnInit, OnDestroy {
  @Input()
  images$: Observable<IBackgroundImageData[]>;
  @Input()
  backgroundOriginalUrls$: Observable<string[]>;
  @Input()
  clickActions: any;
  @Input()
  showMarkerColumn: boolean;
  @Input()
  distanceFrom: number[] = null;
  public imageSelections: { [id: string]: boolean } = {};
  public imageMarkerSelections: { [id: string]: boolean } = {};
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.backgroundOriginalUrls$.pipe(takeUntil(this._destroy$)).subscribe((backgroundOriginalUrls: string[]) => {
      this.imageSelections = {};
      backgroundOriginalUrls.map(url => {
        this.imageSelections[url] = true;
      });
    });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
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
}
