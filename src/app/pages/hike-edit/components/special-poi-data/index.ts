// Core
import { Component, Input } from '@angular/core';

import { GooglePoi, OsmPoi, WikipediaPoi } from '../../../../shared/interfaces';

@Component({
  selector: 'app-special-poi-data',
  templateUrl: 'ui.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: GooglePoi | OsmPoi | WikipediaPoi;
  @Input() openPoiModal: any;
}
