import { Store } from '@ngrx/store';
import { Component, Input } from '@angular/core';

import { DownloadGpxButtonComponent as BaseComponent } from 'subrepos/gtrack-common-ngx';

@Component({
  selector: 'gtrack-download-gpx',
  templateUrl: './download-gpx-button.component.html',
  styleUrls: ['./download-gpx-button.component.scss']
})
export class DownloadGpxButtonComponent extends BaseComponent {}
