import * as flatten from 'flat';
import _isObject from 'lodash-es/isObject';
import _omit from 'lodash-es/omit';
import _pick from 'lodash-es/pick';
import _set from 'lodash-es/set';
import _uniq from 'lodash-es/uniq';

import { Injectable } from '@angular/core';

import { ComparedProperty, FilteredProperties } from '../../interfaces';

@Injectable()
export class PoiMergeService {
  collectFlatKeyValues(pois): FilteredProperties {
    // Collect properties
    const flatProperties: ComparedProperty = {};
    let commonTypes: Array<string> = [];
    let objectTypes: Array<string> = [];

    for (const poi of pois) {
      let flatPoi = flatten(
        _pick(poi, [
          'lat',
          'lon',
          'elevation',
          'published',
          'positions',
          'state',
          'description',
          'timestamp',
          'google',
          'wikipedia',
          'osm'
        ])
      );
      flatPoi.coords = `[${poi.lat}, ${poi.lon}, ${poi.elevation}, ${poi.distFromRoute},  ${poi.onRoute}]`;

      // Remove
      flatPoi = _omit(flatPoi, ['lat', 'lon', 'elevation']);

      for (const key in flatPoi) {
        if (flatPoi[key]) {
          if (!flatProperties[key]) {
            flatProperties[key] = [];
          }
          flatProperties[key].push(flatPoi[key]);
        }
      }

      commonTypes = commonTypes.concat(poi.types.filter(t => ['unknown', 'undefined'].indexOf(t) < 0));
      objectTypes = _uniq(objectTypes.concat(poi.objectTypes));
    }

    // Remove duplicated values and empty objects
    for (const key in flatProperties) {
      if (flatProperties[key]) {
        flatProperties[key] = flatProperties[key].filter(item => !(_isObject(item) && Object.keys(item).length === 0));
        flatProperties[key] = _uniq(flatProperties[key]);
      }
    }

    // Separate
    const filteredProperties: FilteredProperties = {
      unique: {
        types: _uniq(commonTypes),
        objectTypes
      },
      conflicts: {}
    };

    for (const prop in flatProperties) {
      if (flatProperties[prop].length > 1) {
        filteredProperties.conflicts[prop] = flatProperties[prop];
      } else if (flatProperties[prop].length === 1) {
        filteredProperties.unique[prop] = flatProperties[prop][0];
      }
    }

    return filteredProperties;
  }

  createGTrackPoiFromUniqueValues(flatProperties: ComparedProperty): any {
    const poiData = {};

    for (const key in flatProperties) {
      if (flatProperties[key]) {
        _set(poiData, key, flatProperties[key]);
      }
    }

    return poiData;
  }
}
