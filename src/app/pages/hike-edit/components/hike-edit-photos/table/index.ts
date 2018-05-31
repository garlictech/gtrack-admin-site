// Core
import { Component, Input } from '@angular/core';

@Component({
  selector: 'hike-edit-photos-table',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class HikeEditPhotosTableComponent {
  @Input() photos$: any[];
  @Input() subdomain: string;
}
