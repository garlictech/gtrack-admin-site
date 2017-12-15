import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Jsonp, Response } from '@angular/http';
import { ExternalPoi } from './external-poi';
import { GeometryService, CenterRadius } from 'subrepos/gtrack-common-ngx/index';

@Injectable()
export class WikipediaPoiService {
  constructor(
    private _http: HttpClient,
    private _jsonp: Jsonp,
    private _geometryService: GeometryService
  ) {}

  public get(bounds, lang = 'en') {
    const geo: CenterRadius = this._geometryService.getCenterRadius(bounds);
    const request = `https://${lang}.wikipedia.org/w/api.php?action=query&list=geosearch&ggsradius=${geo!.radius}&ggscoord=${geo!.center!.geometry!.coordinates![1]}%7C${geo!.center!.geometry!.coordinates![0]}&format=json&origin=*&prop=coordinates|extracts&exintro=&explaintext=&&exlimit=20&colimit=20`; //&ggslimit=20

    // https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=1991.9683155014077&gscoord=51.50238492343173%7C-0.10350302516392215&format=json&origin=*&prop=coordinates|extracts&exintro=&explaintext=&&exlimit=20&colimit=20

    console.log(request);
    return this._http.get(request)
      .toPromise()
      .then((data: any) => {
        let _res: ExternalPoi[] = [];

        console.log('PAGES', data.query.pages);

        for (let _pointId in data.query.pages) {
          let _point = data.query.pages[_pointId];

          _res.push(new ExternalPoi({
            lat: _point.coordinates[0].lat,
            lon: _point.coordinates[0].lon,
            title: _point.title,
            types: ['sight'],
            objectType: 'wikipedia',
            wikipedia: {
              id: _point.pageid,
              extract: _point.extract,
              url: `https://${lang}.wikipedia.org/?curid=${_point.pageid}`
            }
          }));
        }
        console.log('RES', _res);
        return _res;
      });
  }
}
