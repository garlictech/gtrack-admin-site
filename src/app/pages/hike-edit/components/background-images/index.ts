// Core
import { Component, Input } from '@angular/core';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'gt-background-images',
  template: `<img class="thumbnail" *ngFor="let image of (bgImages$ | async)" [src]="image.thumbnail.url">`,
  styles: ['img.thumbnail { width: 150px; height: 100px; margin: 15px; object-fit: cover; }']
})
export class BackgroundImagesComponent {
  @Input() bgImages$: IBackgroundImageData[];
}
