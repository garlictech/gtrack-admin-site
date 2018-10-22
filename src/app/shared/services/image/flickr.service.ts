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
export class FlickrService {
  constructor(
    private _http: HttpClient,
    private _poiEditorService: PoiEditorService
  ) {}

  public get(bounds, path) {
    const promise: Promise<IBackgroundImageDataStored[]> = new Promise((resolve) => {
      this._batchGet(this._getOnePage, {
        bounds: bounds,
        path: path,
        page: 1,
        results: []
      }).then(_res => {
        resolve(_res);
      });
    });

    return Observable.fromPromise(promise);
  }

  private _batchGet(getter, params) {
    return getter(params).then(result => {
      params.results = params.results.concat(result.data);

      console.log('RESULT', result);

      if (!result.nextParams) {
        return params.results;
      } else {
        params.page = result.nextParams.page;
        return this._batchGet(getter, params);
      }
    });
  }

  private _getOnePage = (params) => {
    console.log('bounds', params.bounds);
    // tslint:disable:max-line-length
    const request = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${environment.flickr.apiKey}&bbox=${params.bounds.SouthWest.lon},${params.bounds.SouthWest.lat},${params.bounds.NorthEast.lon},${params.bounds.NorthEast.lat}&page=${params.page}&privacy_filter=1&content_type=1&extras=geo,description,license,url_n,url_z,url_o,url_k,url_h&format=json&nojsoncallback=1`;
    // tslint:enable:max-line-length

    return this._http
      .get(request)
      .toPromise()
      .then((data: any) => {
        console.log('FLICKR resp', data);

        const _images: IBackgroundImageDataStored[] = [];
        const _photos = _get(data, 'photos.photo', null);

        if (_photos) {
          for (const _photo of _photos) {
            const _image: IBackgroundImageDataStored = {
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
  }
}