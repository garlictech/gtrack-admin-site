import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EPoiTypes, ETextualDescriptionType } from 'subrepos/provider-client';
import { IOsmPoi } from '../../interfaces';
import { LanguageService } from '../language.service';

import * as uuid from 'uuid/v1';
import { Observable } from 'rxjs';

@Injectable()
export class OsmRoutePoiService {
  constructor(private _http: HttpClient) {}

  public get(bounds, lng = 'en') {
    const request = `
      <osm-script output="json" timeout="25">
        <query into="_" type="way">
          <has-kv k="highway" modv="" v="track"/>
          <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${
      bounds.SouthWest.lon
    }"/>
        </query>
        <union into="_">
          <item set="_"/>
          <recurse from="_" into="_" type="down"/>
        </union>
        <print e="" from="_" geometry="skeleton" limit="" mode="body" n="" order="id" s="" w=""/>
      </osm-script>`;

    return this._http
      .post('https://overpass-api.de/api/interpreter', request)
      .switchMap((response: any) => {
        const _res: IOsmPoi[] = [];

        if (response.elements) {
          for (const _point of response.elements) {
            if (_point.tags && _point.lat) {
              // let _type = _point.tags[poiType];

              _res.push({
                id: uuid(),
                lat: _point.lat,
                lon: _point.lon,
                elevation: _point.tags.ele,
                types: [],
                description: {
                  [LanguageService.shortToLocale(lng)]: {
                    title: _point.tags.name || 'unknown',
                    summary: '',
                    fullDescription: '',
                    type: ETextualDescriptionType.markdown
                  }
                },
                objectType: [EPoiTypes.osmRoute],
                osm: {
                  id: _point.id
                },
                selected: false
              });
            }
          }
        }

        return Observable.of(_res);
      });
  }
}
