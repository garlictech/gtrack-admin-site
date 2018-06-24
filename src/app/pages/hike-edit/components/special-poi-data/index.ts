// Core
import { Component, Input } from '@angular/core';
import { IGooglePoi, IOsmPoi, IWikipediaPoi } from 'app/shared/interfaces';

@Component({
  selector: 'gt-special-poi-data',
  templateUrl: 'ui.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: IGooglePoi | IOsmPoi | IWikipediaPoi;
  @Input() openPoiModal: any;
}
