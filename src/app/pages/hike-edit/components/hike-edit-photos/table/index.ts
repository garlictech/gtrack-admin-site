import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from 'app/store';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'gt-hike-edit-photos-table',
  templateUrl: './ui.html'
})
export class HikeEditPhotosTableComponent implements OnInit, OnDestroy {
  @Input() images$: Observable<IBackgroundImageData[]>;
  @Input() backgroundOriginalUrls$: Observable<string[]>;
  @Input() clickActions: any;
  public imageSelections: {[id: string]: boolean} = {}
  private _destroy$: Subject<boolean> = new Subject<boolean>();

  constructor (
    private _store: Store<State>,
  ) {}

  ngOnInit() {
    this.backgroundOriginalUrls$
      .take(1)
      .subscribe((backgroundOriginalUrls: string[]) => {
        this.imageSelections = {};
        backgroundOriginalUrls.map(url => {
          this.imageSelections[url] = true;
        });
      });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
  }

  public toggleBackgroundImage(image: IBackgroundImageData) {
    if (!this.imageSelections[image.original.url]) {
      this.clickActions.remove(image.original.url);
    } else {
      this.clickActions.add(image);
    }
  }
}
