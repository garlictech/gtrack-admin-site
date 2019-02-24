import { environment } from 'environments/environment';
import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import { Observable } from 'rxjs';
import * as uuid from 'uuid/v1';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EPoiImageTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { BackgroundImageDataStored } from '../../interfaces/mapillary-image.interface';
import { PoiEditorService } from '../poi';

const _batchGet = (getter, params): any =>
  getter(params).then(result => {
    params.results = params.results.concat(result.data);

    if (!result.nextParams) {
      return params.results;
    } else {
      params.page = result.nextParams.page;

      return _batchGet(getter, params);
    }
  });

@Injectable()
export class FlickrService {
  constructor(private readonly _http: HttpClient, private readonly _poiEditorService: PoiEditorService) {}

  get(bounds, path): any {
    const promise: Promise<Array<BackgroundImageDataStored>> = new Promise(resolve => {
      _batchGet(this._getOnePage, {
        bounds,
        path,
        page: 1,
        results: []
      }).then(_res => {
        resolve(_res);
      });
    });

    return Observable.fromPromise(promise);
  }

  // tslint:disable:no-property-initializers
  private readonly _getOnePage = params => {
    // tslint:disable:max-line-length
    const request = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${
      environment.flickr.apiKey
    }&bbox=${params.bounds.SouthWest.lon},${params.bounds.SouthWest.lat},${params.bounds.NorthEast.lon},${
      params.bounds.NorthEast.lat
    }&page=${
      params.page
    }&privacy_filter=1&content_type=1&extras=geo,description,license,url_n,url_z,url_o,url_k,url_h&format=json&nojsoncallback=1`;
    // tslint:enable:max-line-length

    return this._http
      .get(request)
      .toPromise()
      .then((data: any) => {
        const _images: Array<BackgroundImageDataStored> = [];
        const _photos = _get(data, 'photos.photo');

        if (_photos) {
          for (const _photo of _photos) {
            const _image: BackgroundImageDataStored = {
              id: uuid(),
              title: 'untitled',
              lat: _photo.latitude,
              lon: _photo.longitude,
              source: {
                type: EPoiImageTypes.flickr,
                poiObjectId: _photo.id
              },
              original: {
                // DOCS: https://www.flickr.com/services/api/misc.urls.html
                url: _photo.url_o || _photo.url_k || _photo.url_h,
                width: _photo.width_o || _photo.width_k || _photo.width_h
              },
              card: {
                url: _photo.url_z,
                width: parseInt(_photo.width_z, 10) || 640
              },
              thumbnail: {
                url: _photo.url_n,
                width: parseInt(_photo.width_n, 10) || 320
              },
              additionalData: _photo.description
            };

            _images.push(_image);
          }
        }

        const result: any = {
          data: this._poiEditorService.organizePoiPhotos(_images, params.path)
        };

        if (data.page < data.pages) {
          result.nextParams = {
            page: data.page++
          };
        }

        return result;
      });
  };
}
