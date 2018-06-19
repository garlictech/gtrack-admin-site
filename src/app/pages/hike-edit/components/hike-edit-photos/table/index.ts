import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from 'app/store';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'gt-hike-edit-photos-table',
  templateUrl: './ui.html'
})
export class HikeEditPhotosTableComponent {
  @Input() images$: Observable<IBackgroundImageData[]>;
  @Input() backgroundOriginalUrls$: Observable<string[]>;
  @Input() clickActions: any;

  constructor (
    private _store: Store<State>,
  ) {}

  public toggleBackgroundImage(image: IBackgroundImageData) {
    this.backgroundOriginalUrls$
      .take(1)
      .subscribe((backgroundOriginalUrls: string[]) => {
        if (backgroundOriginalUrls.indexOf(image.original.url) < 0) {
          this.clickActions.add(image);
        } else {
          this.clickActions.remove(image.original.url);
        }
      });
  }
}
