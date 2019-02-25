import { Pipe, PipeTransform } from '@angular/core';
import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { PrimeNgGalleryImage } from '../interfaces';

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
