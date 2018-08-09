import { Pipe, PipeTransform } from '@angular/core';
import { IBackgroundImageData } from '../../../../provider-client';
import * as turf from '@turf/turf';

@Pipe({
  name: 'poiImagesWithinCircle'
})
export class PoiImagesWithinCirclePipe implements PipeTransform {
  transform(images: IBackgroundImageData[], properties: number[]): IBackgroundImageData[] {
    if (!images) {
      return [];
    } else if (properties) {
      // properties: [lat, lon, distance]
      const filtered =  images.filter((image: IBackgroundImageData) => {
        const imageLocation = turf.point([image.lon, image.lat]);
        const poiLocation = turf.point([properties[1], properties[0]]);
        const dist = turf.distance(imageLocation, poiLocation) * 1000;
        console.log(image, dist);

        return dist <= properties[2];
      });

      return filtered;
    } else {
      return images
    };
  }
}
