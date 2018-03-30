import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jsonp, Response } from '@angular/http';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { EPoiTypes } from 'subrepos/provider-client';
import { GeometryService, CenterRadius } from 'subrepos/gtrack-common-ngx/index';
import { IWikipediaPoi, IWikipediaPageImageInfo } from 'app/shared/interfaces';
import { LanguageService } from '../language.service';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Injectable()
export class WikipediaPoiService {
  constructor(
    private _http: HttpClient,
    private _jsonp: Jsonp,
    private _geometryService: GeometryService,
    private _toasterService: ToasterService
  ) {}

  public get(bounds, lng = 'en') {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);
    const gsLimit = 50;
    const request = `https://${lng}.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${geo!.radius!}&gscoord=${geo!.center!.geometry!.coordinates![1]}%7C${geo!.center!.geometry!.coordinates![0]}&format=json&gslimit=${gsLimit}&origin=*`;

    // Get basic poi list
    return this._http.get(request)
      .toPromise()
      .then((data: any) => {
        let _pois: IWikipediaPoi[] = [];

        if (data.query) {
          for (let _point of data.query.geosearch) {
            let _poi: IWikipediaPoi = {
              id: uuid(),
              lat: _point.lat,
              lon: _point.lon,
              elevation: 0,
              types: ['sight'],
              objectType: EPoiTypes.wikipedia,
              description: {
                [LanguageService.shortToLocale(lng)]: {
                  title: _point.title,
                }
              },
              wikipedia: {}
            };
            _poi.wikipedia = {
              pageid: _point.pageid,
              url: `https://${lng}.wikipedia.org/?curid=${_point.pageid}`,
              lng: lng
            }
            _pois.push(_poi);
          }

          let promises: Promise<IWikipediaPoi[]>[] = [];
          promises.push(this._getPageExtracts(_pois, lng));
          promises.push(this._getPageImages(_pois, lng));

          return Promise.all(promises).then(() => {
            return _pois;
          });
        } else {
          if (data.error) {
            this._toasterService.pop('error', 'Error!', data.error.info || 'Unknown error.');
          }
          return _pois;
        }
      });
  }

  /**
   * get submethod - load wikipedia lead sections
   */
  private _getPageExtracts(_pois: IWikipediaPoi[], lng) {
    const _poiIds = _pois.map((p: IWikipediaPoi) => {
      if (p.wikipedia && p.wikipedia.pageid) {
        return p.wikipedia.pageid
      } else {
        return '';
      }
    });
    const _chunks = _.chunk(_poiIds, 20);

    return Observable
      .interval(100)
      .take(_chunks.length)
      .map(counter => {
        const _ids = _chunks[counter];
        const request = `https://${lng}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&exlimit=max&pageids=${_ids.join('|')}&origin=*`;

        return this._http.get(request)
          .toPromise()
          .then((data: any) => {
            for (let idx in data.query.pages) {
              const _exData = data.query.pages[idx];

              if (_exData.extract) {
                const _targetPoi = _pois.find(p => p.wikipedia!.pageid === _exData.pageid);

                if (_targetPoi && _targetPoi.wikipedia) {
                  _targetPoi.wikipedia.extract = _exData.extract;
                }
              }
            }

            return Observable.of(counter);
          });
      })
      .combineAll()
      .toPromise()
      .then(() => {
        return _pois;
      });
  }

  /**
   * get submethod - load wikipedia page images
   */
  private _getPageImages(_pois: IWikipediaPoi[], lng) {
    const _poiIds = _pois.map((p: IWikipediaPoi) => {
      if (p.wikipedia && p.wikipedia.pageid) {
        return p.wikipedia.pageid
      } else {
        return '';
      }
    });
    const _chunks = _.chunk(_poiIds, 20);

    return Observable
      .interval(100)
      .take(_chunks.length)
      .map(counter => {
        const _ids = _chunks[counter];
        const request = `https://${lng}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|name|thumbnail&pageids=${_ids.join('|')}&origin=*`;

        return this._http.get(request)
          .toPromise()
          .then((imageData: any) => {
            for (let idx in imageData.query.pages) {
              const _imgData = imageData.query.pages[idx];

              if (_imgData.original) {
                const _imageInfo: IWikipediaPageImageInfo = {
                  title: _imgData.title,
                  original: _imgData.original,
                  thumbnail: _imgData.thumbnail
                }
                const _targetPoi = _pois.find(p => p.wikipedia!.pageid === _imgData.pageid);

                if (_targetPoi && _targetPoi.wikipedia) {
                  _targetPoi.wikipedia.pageImage = _imageInfo;
                }
              }
            }

            return Observable.of(counter);
          });
      })
      .combineAll()
      .toPromise()
      .then(() => {
        return _pois;
      });
  }
}
