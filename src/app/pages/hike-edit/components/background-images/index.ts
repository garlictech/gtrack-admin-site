import { Component, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'app-background-images',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class BackgroundImagesComponent {
  @Input()
  bgImages$: IBackgroundImageData[];
  @Input()
  clickActions: any;

  constructor(private _confirmationService: ConfirmationService) {}

  public deleteImage(url: string) {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this.clickActions.remove(url);
      }
    });
  }
}
