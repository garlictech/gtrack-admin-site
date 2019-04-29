import { Pipe, PipeTransform } from '@angular/core';
import { BackgroundImageData, PrimeNgGalleryImage } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

@Pipe({ name: 'poiImagesToGallery' })
export class PoiImagesToGalleryPipe implements PipeTransform {
  transform(images: Array<BackgroundImageData>): Array<PrimeNgGalleryImage> {
    if (!images) {
      return [];
    }

    return images.map(image => ({
      source: image.original.url,
      title: '',
      alt: ''
    }));
  }
}
