import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OsmPoi } from './lib/osm-poi';
import * as uuid from 'uuid';

@Injectable()
export class OsmPoiService {
  constructor(private _http: HttpClient) {}

  public get(bounds, typeParam) {
    const request = `
      <osm-script output="json" timeout="25">
        <union into="_">
          <query into="_" type="node">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="way">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="relation">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
        </union>
        <print e="" from="_" geometry="skeleton" limit="" mode="body" n="" order="id" s="" w=""/>
        <recurse from="_" into="_" type="down"/>
        <print e="" from="_" geometry="skeleton" limit="" mode="skeleton" n="" order="quadtile" s="" w=""/>
      </osm-script>`;

    return this._http.post('http://overpass-api.de/api/interpreter', request)
      .toPromise()
      .then((response: any) => {
        let _res: OsmPoi[] = [];

        for (let i = 0; i < response.elements.length; i++) {
          let point = response.elements[i];
          if (point.tags && point.lat) {
            let type = point.tags[typeParam];

            _res.push(new OsmPoi({
              id: uuid(),
              lat: point.lat,
              lon: point.lon,
              elevation: point.tags.ele,
              types: [type],
              title: point.tags.name || 'unknown',
              objectType: typeParam === 'amenity' ? 'osmAmenity' : 'osmNatural',
              osm: {
                id: point.id
              }
            }));
          }
        }

        return _res;
      });
  }
}
