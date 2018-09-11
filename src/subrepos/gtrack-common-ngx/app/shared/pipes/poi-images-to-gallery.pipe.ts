import { Pipe, PipeTransform } from '@angular/core';
import { IBackgroundImageData } from 'subrepos/provider-client';
import { IPrimeNgGalleryImage } from '../interfaces';

@Pipe({ name: 'poiImagesToGallery' })
export class PoiImagesToGalleryPipe implements PipeTransform {
  transform(images: IBackgroundImageData[]): IPrimeNgGalleryImage[] {
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
