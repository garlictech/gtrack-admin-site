// Core
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'app/store';

@Component({
  selector: 'hike-edit-photos-table',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditPhotosTableComponent {
  @Input() photos$: any[];
  @Input() subdomain: string;

  constructor(
    private _store: Store<State>
  ) {
    console.log(this.subdomain, this.photos$);
  }
}
