import { Component, Input } from '@angular/core';
import { IWikipediaPoi, IGooglePoi, IOsmPoi } from 'app/shared/interfaces';

@Component({
  selector: 'gt-hike-edit-external-poi-info',
  templateUrl: './ui.html'
})
export class HikeEditExternalPoiInfoComponent {
  @Input() poi: IWikipediaPoi | IGooglePoi | IOsmPoi;
}
