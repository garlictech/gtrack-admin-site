import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalPoi } from './external-poi';

@Injectable()
export class OsmRoutePoiService {
  constructor(private _http: HttpClient) {}

  public get(bounds, poiType) {
    const request = `
      <osm-script output="json" timeout="25">
        <query into="_" type="way">
          <has-kv k="highway" modv="" v="track"/>
          <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
        </query>
        <union into="_">
          <item set="_"/>
          <recurse from="_" into="_" type="down"/>
        </union>
        <print e="" from="_" geometry="skeleton" limit="" mode="body" n="" order="id" s="" w=""/>
      </osm-script>`;

    return this._http.post('http://overpass-api.de/api/interpreter', request)
      .toPromise()
      .then((response: any) => {
        let _res = [];

        for (let i = 0; i < response.elements.length; i++) {
          let _point = response.elements[i];
          if (_point.tags && _point.lat) {
            let _type = _point.tags[poiType];

            _res.push(new ExternalPoi({
              lat: _point.lat,
              lon: _point.lon,
              elevation: _point.tags.ele,
              types: [_type],
              title: _point.tags.name || 'unknown',
              objectType: 'osm',
              osm: {
                id: _point.id
              }
            }));
          }
        }

        return _res;
      });
  }
}
