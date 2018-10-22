import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

import * as uuid from 'uuid/v1';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import { IBackgroundImageDataStored } from '../../interfaces/mapillary-image.interface';
import { EPoiImageTypes } from 'subrepos/provider-client';
import { Observable } from 'rxjs';
import { PoiEditorService } from '../poi';

@Injectable()
export class MapillaryService {
  constructor(
    private _http: HttpClient,
    private _poiEditorService: PoiEditorService
  ) {}

  public get(bounds, path) {
    // tslint:disable:max-line-length
    const request = `https://a.mapillary.com/v3/images?client_id=${environment.mapillary.clientID}&bbox=${bounds.SouthWest.lon},${bounds.SouthWest.lat},${bounds.NorthEast.lon},${bounds.NorthEast.lat}`;
    // tslint:enable:max-line-length

    return this._http
      .get(request)
      .switchMap((response: any) => {
        const _features = _get(response, 'features');
        let _images: IBackgroundImageDataStored[] = [];

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
              additionalData: _cloneDeep(_feature.properties)
            };

            _images.push(_image);
          }
        }

        return Observable.of(this._poiEditorService.organizePoiPhotos(_images, path));
      });
  }
}
