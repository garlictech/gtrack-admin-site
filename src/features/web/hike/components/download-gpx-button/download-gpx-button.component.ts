import { Component } from '@angular/core';

import { DownloadGpxButtonComponent as BaseComponent } from '@features/common/hike';

@Component({
  selector: 'gtrack-download-gpx',
  templateUrl: './download-gpx-button.component.html',
  styleUrls: ['./download-gpx-button.component.scss']
})
export class DownloadGpxButtonComponent extends BaseComponent {}
