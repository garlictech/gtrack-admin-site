import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExternalPoi } from './external-poi';

@Injectable()
export class OsmPoiService {
  constructor(private _http: HttpClient) {}

  public get(bounds, poiType) {
    const request = `
      <osm-script output="json" timeout="25">
        <union into="_">
          <query into="_" type="node">
            <has-kv k="${poiType}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="way">
            <has-kv k="${poiType}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="relation">
            <has-kv k="${poiType}" modv="" v=""/>
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
        let _res = [];

        for (let i = 0; i < response.elements.length; i++) {
          let point = response.elements[i];
          if (point.tags && point.lat) {
            let type = point.tags[poiType];

            _res.push(new ExternalPoi({
              lat: point.lat,
              lon: point.lon,
              elevation: point.tags.ele,
              types: [type],
              title: point.tags.name || 'unknown',
              objectType: 'osm',
              osm: {
                id: point.id
              }
            }));
          }
        }
        console.log('_res', _res);

        return _res;
      });
  }
}

/*
$http.post "http://overpass-api.de/api/interpreter", request
.then (data) ->
  res = []
  for point in data.data.elements
    if point.tags? and point.lat?
      type = point.tags[poiType]

      res.push new ExternalPoi
        lat: point.lat
        lon: point.lon
        elevation: point.tags.ele
        types: [type]
        title: point.tags.name ? 'unknown'
        objectType: 'osm'
        osm:
          id: point.id

  return res */
