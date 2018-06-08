import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, editedHikeProgramActions } from 'app/store';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'hike-edit-photos-table',
  templateUrl: './ui.html'
})
export class HikeEditPhotosTableComponent {
  @Input() images$: any[];
  @Input() subdomain: string;
  @Input() backgroundOriginalUrls$: Observable<string[]>;

  constructor (
    private _store: Store<State>,
  ) {}

  public toggleBackgroundImage(image: IBackgroundImageData) {
    this.backgroundOriginalUrls$
      .take(1)
      .subscribe((backgroundOriginalUrls: string[]) => {
        if (backgroundOriginalUrls.indexOf(image.original.url) < 0) {
          this._store.dispatch(new editedHikeProgramActions.AddBackgroundImage(image));
        } else {
          this._store.dispatch(new editedHikeProgramActions.RemoveBackgroundImage(image.original.url));
        }
      });
  }
}
