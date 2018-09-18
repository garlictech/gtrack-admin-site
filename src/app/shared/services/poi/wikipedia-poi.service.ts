import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EPoiTypes, IBackgroundImageData, EPoiImageTypes } from 'subrepos/provider-client';
import { GeometryService, CenterRadius } from 'subrepos/gtrack-common-ngx';
import { IWikipediaPoi } from '../../interfaces';
import { LanguageService } from '../language.service';
import { HikeProgramService } from '../hike/hike-program.service';
import { MessageService } from 'primeng/api';

import * as _ from 'lodash';
import * as uuid from 'uuid/v1';

@Injectable()
export class WikipediaPoiService {
  constructor(
    private _http: HttpClient,
    private _geometryService: GeometryService,
    private _messageService: MessageService,
    private _hikeProgramService: HikeProgramService,
  ) {}

  public get(bounds, lng = 'en') {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);
    const gsLimit = 500;
    const request = `https://${lng}.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${geo!.radius!}&gscoord=${geo!.center!.geometry!.coordinates![1]}%7C${geo!.center!.geometry!.coordinates![0]}&format=json&gslimit=${gsLimit}&origin=*`;

    // Get basic poi list
    return this._http.get(request)
      .toPromise()
      .then((data: any) => {
        const _pois: IWikipediaPoi[] = [];

        if (data.query) {
          for (const _point of data.query.geosearch) {
            const _poi: IWikipediaPoi = {
              id: uuid(),
              lat: _point.lat,
              lon: _point.lon,
              elevation: 0,
              types: ['sight'],
              objectType: EPoiTypes.wikipedia,
              description: {
                [LanguageService.shortToLocale(lng)]: {
                  title: _point.title,
                  summary: '',
                  fullDescription: '',
                }
              },
              wikipedia: {},
              selected: false
            };
            _poi.wikipedia = {
              pageid: _point.pageid,
              url: `https://${lng}.wikipedia.org/?curid=${_point.pageid}`,
              lng: lng
            };
            _pois.push(_poi);
          }

          return _pois;
        } else {
          if (data.error) {
            this._messageService.add({
              severity: 'error',
              summary: 'Error!',
              detail: data.error.info || 'Unknown error.',
              life: 8000
            });

          }
          return _pois;
        }
      });
  }

  public getPoiDetails(pois: IWikipediaPoi[]) {
    const langs: string[] = this._hikeProgramService.getDescriptionLaguages();
    const promises: Promise<IWikipediaPoi[]>[] = [];

    for (const lng of langs) {
      const langPois = _.filter(pois, p => p.wikipedia.lng === lng);

      promises.push(this._getPageExtracts(langPois, lng));
      promises.push(this._getPageImages(langPois, lng));
    }

    return Promise.all(promises).then(() => {
      return pois;
    });
  }

  /**
   * get submethod - load wikipedia lead sections
   */
  private _getPageExtracts(_pois: IWikipediaPoi[], lng) {
    const _poiIds = _pois.map((p: IWikipediaPoi) => {
      if (p.wikipedia && p.wikipedia.pageid) {
        return p.wikipedia.pageid;
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
            for (const idx in data.query.pages) {
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
        return p.wikipedia.pageid;
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
            for (const idx in imageData.query.pages) {
              const _imgData = imageData.query.pages[idx];

              if (_imgData.original) {
                // Rename properties
                _imgData.original.url = _imgData.original.source;
                _imgData.thumbnail.url = _imgData.thumbnail.source;
                delete _imgData.original.source;
                delete _imgData.thumbnail.source;

                const _imageInfo: IBackgroundImageData = {
                  title: _imgData.title,
                  lat: _pois.find((p: IWikipediaPoi) => p.wikipedia.pageid === _imgData.pageid).lat,
                  lon: _pois.find((p: IWikipediaPoi) => p.wikipedia.pageid === _imgData.pageid).lon,
                  original: _imgData.original,
                  card: _imgData.original,
                  thumbnail: _imgData.thumbnail,
                  source: {
                    type: EPoiImageTypes.wikipedia,
                    poiObjectId: _imgData.pageid
                  }
                };
                const _targetPoi = _pois.find(p => p.wikipedia!.pageid === _imgData.pageid);

                if (_targetPoi && _targetPoi.wikipedia) {
                  _targetPoi.wikipedia.photos = [_imageInfo];
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
