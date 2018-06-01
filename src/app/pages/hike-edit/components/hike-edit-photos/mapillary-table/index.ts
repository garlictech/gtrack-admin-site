import { Component, Input } from '@angular/core';

@Component({
  selector: 'hike-edit-photos-mapillary-images-table',
  templateUrl: './ui.html'
})
export class HikeEditMapillaryImageTableComponent {
  @Input() images$: any[];
}

// https://d1cuyjsrcm0gby.cloudfront.net/<IMAGE_KEY>/thumb-320.jpg
// https://d1cuyjsrcm0gby.cloudfront.net/<IMAGE_KEY>/thumb-640.jpg
// https://d1cuyjsrcm0gby.cloudfront.net/<IMAGE_KEY>/thumb-1024.jpg
// https://d1cuyjsrcm0gby.cloudfront.net/<IMAGE_KEY>/thumb-2048.jpg
