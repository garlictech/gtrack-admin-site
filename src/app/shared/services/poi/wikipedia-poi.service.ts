import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jsonp, Response } from '@angular/http';
import { ExternalPoi } from './external-poi';
import { GeometryService } from '../../../../subrepos/gtrack-common-ngx/index';

@Injectable()
export class WikipediaPoiService {
  constructor(
    private _http: HttpClient,
    private _jsonp: Jsonp,
    private _geometryService: GeometryService
  ) {}

  public get(bounds, lang = 'en') {
    const geo = this._geometryService.getCenterRadius(bounds);
    const request = `https://${lang}.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${geo.radius}&gscoord=${geo.center.geometry.coordinates[1]}%7C${geo.center.geometry.coordinates[0]}&format=json&gslimit=500&origin=*`;

    return this._http.get(request)
      .toPromise()
      .then((data: any) => {
        let _res = [];

        for (let i = 0; i < data.query.geosearch.length; i++) {
          let _point = data.query.geosearch[i];

          _res.push(new ExternalPoi({
            lat: _point.lat,
            lon: _point.lon,
            title: _point.title,
            types: ['sight'],
            objectType: 'wikipedia',
            wikipedia: {
              id: _point.pageid,
              url: `https://${lang}.wikipedia.org/?curid=${_point.pageid}`
            }
          }));
        }

        return _res;
      });
  }
}
