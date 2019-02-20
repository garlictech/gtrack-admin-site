import { ConfirmationService } from 'primeng/api';
import { BackgroundImageData } from 'subrepos/provider-client';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-background-images',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class BackgroundImagesComponent {
  @Input() bgImages$: Array<BackgroundImageData>;
  @Input() clickActions: any;

  constructor(private readonly _confirmationService: ConfirmationService) {}

  deleteImage(url: string): void {
    this._confirmationService.confirm({
      message: 'Are you sure that you want to delete?',
      accept: () => {
        this.clickActions.remove(url);
      }
    });
  }

  trackByFn(index: number): number {
    return index;
  }
}
