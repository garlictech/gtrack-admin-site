// Core
import { Component, Input } from '@angular/core';
import { IExternalPoi } from 'app/shared/interfaces/index';

@Component({
  selector: 'special-poi-data',
  templateUrl: 'special-poi-data.component.html'
})
export class SpecialPoiDataComponent {
  @Input() poi: IExternalPoi;
}
