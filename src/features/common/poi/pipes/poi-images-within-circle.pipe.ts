import { Pipe, PipeTransform } from '@angular/core';
import { BackgroundImageData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import distance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';

@Pipe({
  name: 'poiImagesWithinCircle'
})
export class PoiImagesWithinCirclePipe implements PipeTransform {
  transform(images: Array<BackgroundImageData>, properties: Array<number>): Array<BackgroundImageData> {
    if (!images) {
      return [];
    } else if (properties) {
      // properties: [lat, lon, distance]
      return images.filter((image: BackgroundImageData) => {
        const imageLocation = turfPoint([image.lon, image.lat]);
        const poiLocation = turfPoint([properties[1], properties[0]]);
        const dist = distance(imageLocation, poiLocation) * 1000;

        return dist <= properties[2];
      });
    } else {
      return images;
    }
  }
}
