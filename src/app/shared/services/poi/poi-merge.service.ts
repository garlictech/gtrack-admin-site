import { Injectable } from '@angular/core';
import { IComparedProperty, IFilteredProperties } from '../../interfaces';

import * as flatten from 'flat';
import _pick from 'lodash-es/pick';
import _omit from 'lodash-es/omit';
import _uniq from 'lodash-es/uniq';
import _set from 'lodash-es/set';
import _isObject from 'lodash-es/isObject';

@Injectable()
export class PoiMergeService {

  public collectFlatKeyValues(pois) {
    // Collect properties
    const flatProperties: IComparedProperty = {};
    let commonTypes: string[] = [];
    let objectTypes: string[] = [];

    for (const poi of pois) {
      let flatPoi = flatten(_pick(poi, [
        'lat', 'lon', 'elevation', 'published', 'positions', 'state', 'timestamp', 'google', 'wikipedia'
      ]));
      flatPoi.coords = `[${poi.lat}, ${poi.lon}, ${poi.elevation}, ${poi.distFromRoute}]`;

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
      objectTypes = _uniq(objectTypes.concat(poi.objectType));
    }

    // Remove duplicated values and empty objects
    for (const key in flatProperties) {
      if (flatProperties[key]) {
        flatProperties[key] = flatProperties[key].filter(item => !(_isObject(item) && Object.keys(item).length === 0));
        flatProperties[key] = _uniq(flatProperties[key]);
      }
    }

    // Separate
    const filteredProperties: IFilteredProperties = {
      unique: {
        types: _uniq(commonTypes),
        objectType: objectTypes
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

  public createGTrackPoiFromUniqueValues(flatProperties: IComparedProperty) {
    const poiData = {};

    for (const key in flatProperties) {
      if (flatProperties[key]) {
        _set(poiData, key, flatProperties[key]);
      }
    }

    return poiData;
  }
}
