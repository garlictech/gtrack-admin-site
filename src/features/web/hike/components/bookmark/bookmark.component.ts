import { State } from 'app/store';

import { Component } from '@angular/core';
import { AuthenticationSelectors } from '@features/common/authentication';
import { BookmarkComponent as BaseComponent } from '@features/common/hike/components/bookmark';
import { ObjectMarkSelectors } from '@features/common/object-mark';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';

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
