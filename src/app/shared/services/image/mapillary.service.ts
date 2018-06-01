import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import { IMapillaryImageStored } from '../../interfaces/mapillary-image.interface';

@Injectable()
export class MapillaryService {
  constructor(private _http: HttpClient) {}

  public get(bounds) {
    const request = `https://a.mapillary.com/v3/images?client_id=${environment.mapillary.clientID}&bbox=${bounds.SouthWest.lon},${bounds.SouthWest.lat},${bounds.NorthEast.lon},${bounds.NorthEast.lat}`;

    return this._http
      .get(request)
      .toPromise()
      .then((response: any) => {
        const _features = _.get(response, 'features');
        const _images: IMapillaryImageStored[] = [];

        if (_features) {
          for (let _feature of _features) {
            const _image = _.cloneDeep(_feature.properties);
            _image.id = uuid();
            _images.push(_image);
          }
        }

        return _images;
      });
  }
}
