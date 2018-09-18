import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EPoiTypes } from 'subrepos/provider-client';
import { IOsmPoi } from '../../interfaces';
import { LanguageService } from '../language.service';

import * as uuid from 'uuid/v1';
import * as _ from 'lodash';

@Injectable()
export class OsmPoiService {
  constructor(
    private _http: HttpClient
  ) {}

  public get(bounds, typeParam, lng = 'en') {
    const request = `
      <osm-script output="json" timeout="25">
        <union into="_">
          <query into="_" type="node">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${
      bounds.SouthWest.lat
    }" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="way">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${
      bounds.SouthWest.lat
    }" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="relation">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${
      bounds.SouthWest.lat
    }" w="${bounds.SouthWest.lon}"/>
          </query>
        </union>
        <print e="" from="_" geometry="skeleton" limit="" mode="body" n="" order="id" s="" w=""/>
        <recurse from="_" into="_" type="down"/>
        <print e="" from="_" geometry="skeleton" limit="" mode="skeleton" n="" order="quadtile" s="" w=""/>
      </osm-script>`;

    return this._http
      .post('https://overpass-api.de/api/interpreter', request)
      .toPromise()
      .then((response: any) => {
        const _res: IOsmPoi[] = [];

        if (response.elements) {
          for (const _point of response.elements) {
            const type = _.get(_point.tags, typeParam);

            if (_point.lat && this._checkPoiTags(_point, type)) {
              _res.push({
                id: uuid(),
                lat: _point.lat,
                lon: _point.lon,
                elevation: _point.tags.ele,
                types: [type],
                description: {
                  [LanguageService.shortToLocale(lng)]: {
                    title: _point.tags.name || LanguageService.pascalize(type) || 'unknown',
                    summary: '',
                    fullDescription: ''
                  }
                },
                objectType: typeParam === 'amenity' ? EPoiTypes.osmAmenity : EPoiTypes.osmNatural,
                osm: {
                  id: _point.id
                },
                selected: false
              });
            }
          }
        }

        return _res;
      });
  }

  private _checkPoiTags(_point, type) {
    if (_point.tags) {
      if (type === 'tree') {
        return _point.tags.name ? true : false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
