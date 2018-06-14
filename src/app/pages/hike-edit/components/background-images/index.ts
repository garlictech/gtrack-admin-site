import { Component, Input } from '@angular/core';
import { IBackgroundImageData } from 'subrepos/provider-client';

@Component({
  selector: 'gt-background-images',
  template: `
  <ng-container *ngIf="(bgImages$ | async) as bgImages">
    <img class="thumbnail" *ngFor="let image of bgImages" [src]="image.thumbnail.url">
  <ng-container>
  `,
  styles: ['img.thumbnail { width: 150px; height: 100px; margin: 15px; object-fit: cover; }']
})
export class BackgroundImagesComponent {
  @Input() bgImages$: IBackgroundImageData[];
}
