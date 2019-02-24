// Core
import { Component, Input } from '@angular/core';

import { GooglePoi, IOsmPoi, IWikipediaPoi } from '../../../../shared/interfaces';

@Component({
  selector: 'app-special-poi-data',
  templateUrl: 'ui.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: GooglePoi | IOsmPoi | IWikipediaPoi;
  @Input() openPoiModal: any;
}
