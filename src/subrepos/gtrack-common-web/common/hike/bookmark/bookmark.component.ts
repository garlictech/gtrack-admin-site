import { Component } from '@angular/core';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { State } from 'app/store';
import {
  AuthenticationSelectors,
  BookmarkComponent as BaseComponent,
  ObjectMarkSelectors
} from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-bookmark',
  templateUrl: './bookmark.component.html'
})
export class BookmarkComponent extends BaseComponent {
  icons: {
    [key: string]: IconDefinition;
  };

  constructor(
    protected _objectMarkSelectors: ObjectMarkSelectors,
    protected _authSelectors: AuthenticationSelectors.Selectors,
    protected _store: Store<State>
  ) {
    super(_objectMarkSelectors, _authSelectors, _store);
    this.icons = {
      regular: faBookmarkRegular,
      solid: faBookmarkSolid
    };
  }
}
