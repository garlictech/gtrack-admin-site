import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';
import { IBackgroundImageDataStored } from '../../interfaces/mapillary-image.interface';
import { EPoiImageTypes } from 'subrepos/provider-client';

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
        const _images: IBackgroundImageDataStored[] = [];

        if (_features) {
          for (const _feature of _features) {
            const _image: IBackgroundImageDataStored = {
              id: uuid(),
              title: 'untitled',
              lat: _feature.geometry.coordinates[1],
              lon: _feature.geometry.coordinates[0],
              source: {
                type: EPoiImageTypes.mapillary,
                poiObjectId: _feature.properties.key
              },
              original: {
                url: `https://d1cuyjsrcm0gby.cloudfront.net/${_feature.properties.key}/thumb-2048.jpg`,
                width: 2048
              },
              card: {
                url: `https://d1cuyjsrcm0gby.cloudfront.net/${_feature.properties.key}/thumb-640.jpg`,
                width: 640
              },
              thumbnail: {
                url: `https://d1cuyjsrcm0gby.cloudfront.net/${_feature.properties.key}/thumb-320.jpg`,
                width: 320
              },
              additionalData: _.cloneDeep(_feature.properties)
            };

            _images.push(_image);
          }
        }

        return _images;
      });
  }
}
