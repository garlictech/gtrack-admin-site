import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hike-edit-external-poi-info',
  templateUrl: './ui.html'
})
export class HikeEditExternalPoiInfoComponent {
  @Input() poi: any;
}
