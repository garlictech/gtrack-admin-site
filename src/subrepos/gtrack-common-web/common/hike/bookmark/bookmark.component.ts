import { Component } from '@angular/core';
import { BookmarkComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'gtrack-bookmark',
  templateUrl: './bookmark.component.html'
})
export class BookmarkComponent extends BaseComponent {
  public icons = {
    regular: faBookmarkRegular,
    solid: faBookmarkSolid
  };
}
