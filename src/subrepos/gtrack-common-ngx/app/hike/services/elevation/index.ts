import { Injectable } from '@angular/core';
import { GoogleMapsService } from '../../../shared';
import { /**/ } from '@types/googlemaps';

@Injectable()
export class ElevationService {

  constructor(private googleMapsService: GoogleMapsService) { }

  public calculateUphill(data: number[][]): number {
    return this._calculateHill(data, (diff) => (diff > 0));
  }

  public calculateDownhill(data: number[][]): number {
    return this._calculateHill(data, (diff) => (diff < 0), -1);
  }

  public getData(coordinates: number[][]): Promise<number[][]> {
    return this.googleMapsService.map
      .then(() => {
        let locations: google.maps.LatLng[] = coordinates.map((coordinate: number[]) => {
          return new google.maps.LatLng(coordinate[0], coordinate[1]);
        });

        let elevationService: google.maps.ElevationService = new google.maps.ElevationService();
        let request: google.maps.LocationElevationRequest = {
          locations: locations
        };

        return new Promise<number[][]>((resolve, reject) => {
          elevationService
            .getElevationForLocations(request, (results: google.maps.ElevationResult[], status: google.maps.ElevationStatus) => {
              if (results) {
                let elevations: number[][] = results.map((point: google.maps.ElevationResult) => {
                  return [point.location.lat(), point.location.lng(), point.elevation];
                });

                resolve(elevations);
              } else {
                reject(status);
              }
            });
        });
      });
  }

  private _calculateHill(data: number[][], bigEnough: ((diff: number) => boolean), multiplier = 1): number {
    let sum = 0;

    data.forEach((point, i) => {
      if (i > 0) {
        let diff = point[2] - data[i - 1][2];

        if (bigEnough(diff) === true) {
          sum += (diff * multiplier);
        }
      }
    });

    return sum;
  }
}
