import { Injectable } from '@angular/core';
import { IComparedProperty, IFilteredProperties } from '../../interfaces';
import * as flatten from 'flat';
import * as _ from 'lodash';

@Injectable()
export class PoiMergeService {

  public collectFlatKeyValues(pois) {
    // Collect properties
    const flatProperties: IComparedProperty = {}
    let commonTypes: string[] = [];
    let objectTypes: string[] = [];

    for (const poi of pois) {
      const flatPoi = flatten(_.omit(poi, ['id', 'lat', 'lon', 'elevation', 'published', 'positions', 'types', 'state', 'timestamp', 'objectType']));
      flatPoi.coords = `[${poi.lat}, ${poi.lon}, ${poi.elevation}]`;

      for (const key in flatPoi) {
        if (!flatProperties[key]) {
          flatProperties[key] = [];
        }
        flatProperties[key].push(flatPoi[key]);
      }

      commonTypes = commonTypes.concat(poi.types.filter(t => ['unknown', 'undefined'].indexOf(t) < 0));
      objectTypes = objectTypes.concat(poi.objectType);
    }

    // Remove duplicated values and empty objects
    for (const key in flatProperties) {
      flatProperties[key] = flatProperties[key].filter(item => !(_.isObject(item) && Object.keys(item).length === 0));
      flatProperties[key] = _.uniq(flatProperties[key]);
    }

    // Separate
    const filteredProperties: IFilteredProperties = {
      unique: {
        types: _.uniq(commonTypes),
        objectTypes: objectTypes
      },
      conflicts: {}
    }

    for (let prop in flatProperties) {
      if (flatProperties[prop].length > 1) {
        filteredProperties.conflicts[prop] = flatProperties[prop];
      } else if (flatProperties[prop].length === 1) {
        filteredProperties.unique[prop] = flatProperties[prop][0];
      }
    }

    return filteredProperties;
  }

  public createGTrackPoiFromUniqueValues(flatProperties: IComparedProperty) {
    let poiData = {};

    for (const key in flatProperties) {
      _.set(poiData, key, flatProperties[key]);
    }

    return poiData;
  }
}
