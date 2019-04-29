import _chunk from 'lodash-es/chunk';
import _filter from 'lodash-es/filter';
import _get from 'lodash-es/get';
import { MessageService } from 'primeng/api';
import { interval, Observable, of } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';
import * as uuid from 'uuid/v1';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BackgroundImageData,
  EPoiImageTypes,
  EPoiTypes,
  ETextualDescriptionType
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { CenterRadius, GeometryService } from '@features/common/geometry';

import { WikipediaPoi } from '../../interfaces';
import { HikeProgramService } from '../hike/hike-program.service';
import { AdminLanguageService } from '../language.service';

const WIKIPEDIA_PAGEID = 'wikipedia.pageid';

@Injectable()
export class WikipediaPoiService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _geometryService: GeometryService,
    private readonly _messageService: MessageService,
    private readonly _hikeProgramService: HikeProgramService
  ) {}

  get(bounds, lng = 'en'): Observable<Array<WikipediaPoi>> {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);
    const gsLimit = 500;

    // tslint:disable:max-line-length
    const request = `https://${lng}.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${
      geo.radius
    }&gscoord=${geo.center.geometry.coordinates[1]}%7C${
      geo.center.geometry.coordinates[0]
    }&format=json&gslimit=${gsLimit}&origin=*`;
    // tslint:enable:max-line-length

    // Get basic poi list
    return (
      this._http
        .get(request)
        // .toPromise()
        .switchMap((data: any) => {
          const _pois: Array<WikipediaPoi> = [];

          if (data.query) {
            for (const _point of data.query.geosearch) {
              const _poi: WikipediaPoi = {
                id: uuid(),
                lat: _point.lat,
                lon: _point.lon,
                elevation: 0,
                types: ['sight'],
                objectTypes: [EPoiTypes.wikipedia],
                description: {
                  [AdminLanguageService.shortToLocale(lng)]: {
                    title: _point.title,
                    summary: '',
                    fullDescription: '',
                    type: ETextualDescriptionType.markdown
                  }
                },
                wikipedia: {},
                selected: false
              };
              _poi.wikipedia = {
                pageid: _point.pageid,
                url: `https://${lng}.wikipedia.org/?curid=${_point.pageid}`,
                lng
              };
              _pois.push(_poi);
            }

            return Observable.of(_pois);
          } else {
            if (data.error) {
              this._messageService.add({
                severity: 'error',
                summary: 'Error!',
                detail: data.error.info || 'Unknown error.',
                life: 8000
              });
            }

            return of(_pois);
          }
        })
    );
  }

  /**
   * handlePoiDetails() submethod
   */
  async getPoiDetails(pois: Array<WikipediaPoi>): Promise<Array<WikipediaPoi>> {
    const langs: Array<string> = this._hikeProgramService.getDescriptionLanguages();
    const promises: Array<Promise<Array<WikipediaPoi>>> = [];

    for (const lng of langs) {
      const langPois = _filter(pois, p => _get(p, 'wikipedia.lng') === lng);

      promises.push(this._getPageExtracts(langPois, lng));
      promises.push(this._getPageImages(langPois, lng));
    }

    return Promise.all(promises).then(() => pois);
  }

  /**
   * get submethod - load wikipedia lead sections
   */
  private async _getPageExtracts(_pois: Array<WikipediaPoi>, lng): Promise<Array<WikipediaPoi>> {
    const _poiIds = _pois.map((p: WikipediaPoi) => _get(p, WIKIPEDIA_PAGEID, ''));
    const _chunks = _chunk(_poiIds, 20);

    return interval(100)
      .pipe(
        take(_chunks.length),
        map(async counter => {
          const _ids = _chunks[counter];
          // tslint:disable:max-line-length
          const request = `https://${lng}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&exlimit=max&pageids=${_ids.join(
            '|'
          )}&origin=*`;
          // tslint:enable:max-line-length

          return this._http
            .get(request)
            .toPromise()
            .then((data: any) => {
              for (const idx in data.query.pages) {
                if (data.query.pages[idx]) {
                  const _exData = data.query.pages[idx];

                  if (_exData.extract) {
                    const _targetPoi = _pois.find(p => _get(p, WIKIPEDIA_PAGEID) === _exData.pageid);

                    if (_targetPoi && _targetPoi.wikipedia) {
                      _targetPoi.wikipedia.extract = _exData.extract;
                    }
                  }
                }
              }

              return of(counter);
            });
        }),
        combineAll()
      )
      .toPromise()
      .then(() => _pois);
  }

  /**
   * get submethod - load wikipedia page images
   */
  private async _getPageImages(_pois: Array<WikipediaPoi>, lng): Promise<Array<WikipediaPoi>> {
    const _poiIds = _pois.map((p: WikipediaPoi) => _get(p, WIKIPEDIA_PAGEID, ''));
    const _chunks = _chunk(_poiIds, 20);

    return interval(100)
      .pipe(
        take(_chunks.length),
        map(async counter => {
          const _ids = _chunks[counter];
          // tslint:disable:max-line-length
          const request = `https://${lng}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|name|thumbnail&pageids=${_ids.join(
            '|'
          )}&origin=*`;
          // tslint:enable:max-line-length

          return this._http
            .get(request)
            .toPromise()
            .then((imageData: any) => {
              for (const idx in imageData.query.pages) {
                if (imageData.query.pages[idx]) {
                  const _imgData = imageData.query.pages[idx];

                  if (_imgData.original) {
                    // Rename properties
                    _imgData.original.url = _imgData.original.source;
                    _imgData.thumbnail.url = _imgData.thumbnail.source;
                    delete _imgData.original.source;
                    delete _imgData.thumbnail.source;

                    const wikipediaPoi = _pois.find((p: WikipediaPoi) => _get(p, WIKIPEDIA_PAGEID) === _imgData.pageid);

                    if (wikipediaPoi) {
                      const _imageInfo: BackgroundImageData = {
                        title: _imgData.title,
                        lat: wikipediaPoi.lat,
                        lon: wikipediaPoi.lon,
                        original: _imgData.original,
                        card: _imgData.original,
                        thumbnail: _imgData.thumbnail,
                        source: {
                          type: EPoiImageTypes.wikipedia,
                          poiObjectId: _imgData.pageid
                        }
                      };

                      const _targetPoi = _pois.find(p => _get(p, WIKIPEDIA_PAGEID) === _imgData.pageid);

                      if (_targetPoi && _targetPoi.wikipedia) {
                        _targetPoi.wikipedia.photos = [_imageInfo];
                      }
                    }
                  }
                }
              }

              return of(counter);
            });
        }),
        combineAll()
      )
      .toPromise()
      .then(() => _pois);
  }
}
