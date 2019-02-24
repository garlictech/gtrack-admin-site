import { ConfirmationService } from 'primeng/api';
import { Observable, of } from 'rxjs';

import { Component, Input } from '@angular/core';
import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Component({
  selector: 'app-background-images',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss']
})
export class BackgroundImagesComponent {
  @Input() bgImages$: Observable<Array<BackgroundImageData>>;
  @Input() clickActions: any;

  constructor(private readonly _confirmationService: ConfirmationService) {
    this.bgImages$ = of([]);
  }

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
