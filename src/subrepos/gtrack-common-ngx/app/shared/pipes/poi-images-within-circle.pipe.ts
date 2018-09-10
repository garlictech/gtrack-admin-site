import { Pipe, PipeTransform } from '@angular/core';
import { IBackgroundImageData } from 'subrepos/provider-client';
import { point as turfPoint } from '@turf/helpers';
import distance from '@turf/distance';

@Pipe({
  name: 'poiImagesWithinCircle'
})
export class PoiImagesWithinCirclePipe implements PipeTransform {
  transform(images: IBackgroundImageData[], properties: number[]): IBackgroundImageData[] {
    if (!images) {
      return [];
    } else if (properties) {
      // properties: [lat, lon, distance]
      const filtered = images.filter((image: IBackgroundImageData) => {
        const imageLocation = turfPoint([image.lon, image.lat]);
        const poiLocation = turfPoint([properties[1], properties[0]]);
        const dist = distance(imageLocation, poiLocation) * 1000;

        return dist <= properties[2];
      });

      return filtered;
    } else {
      return images;
    }
  }
}
