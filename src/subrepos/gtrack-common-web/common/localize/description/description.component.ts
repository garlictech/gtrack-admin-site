import { Component } from '@angular/core';
import { DescriptionComponent as BaseComponent } from 'subrepos/gtrack-common-ngx/app/localize';
import { ETextualDescriptionType } from '../../../../provider-client';

@Component({
  selector: 'gtrack-description',
  templateUrl: './description.component.html'
})
export class DescriptionComponent extends BaseComponent {
  public ETextualDescriptionType = ETextualDescriptionType;
}
