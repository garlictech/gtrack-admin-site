import { Injectable } from '@angular/core';
import * as flatten from 'flat';
import * as _ from 'lodash';
import { IDynamicComponentModalConfig, DynamicModalService } from 'subrepos/gtrack-common-ngx';
import { IComparedProperty, IFilteredProperties } from '../../interfaces';

@Injectable()
export class PoiMergeService {

  constructor(
    private _dynamicModalService: DynamicModalService
  ) {}

  public collectFlatKeyValues(pois) {
    // Collect properties
    const flatProperties: IComparedProperty = {}
    let commonTypes: string[] = [];

    for (const poi of pois) {
      const flatPoi = flatten(_.omit(poi, ['id', 'lat', 'lon', 'elevation', 'published', 'positions', 'types', 'state', 'timestamp']));
      flatPoi.coords = `[${poi.lat}, ${poi.lon}, ${poi.elevation}]`;

      for (const key in flatPoi) {
        if (!flatProperties[key]) {
          flatProperties[key] = [];
        }
        flatProperties[key].push(flatPoi[key]);
      }

      commonTypes = commonTypes.concat(poi.types.filter(t => ['unknown', 'undefined'].indexOf(t) < 0));
    }

    // Remove duplicated values and empty objects
    for (const key in flatProperties) {
      flatProperties[key] = flatProperties[key].filter(item => !(_.isObject(item) && Object.keys(item).length === 0));
      flatProperties[key] = _.uniq(flatProperties[key]);
    }

    // Separate
    const filteredProperties: IFilteredProperties = {
      unique: {
        types: _.uniq(commonTypes)
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

  public openConflictModal(conflicts: IComparedProperty, callback: any) {
    const modalConfig: IDynamicComponentModalConfig = {
      component: {
        contentComponentName: 'HikeEditMergeGTrackPoiComponent',
        data: {
          conflicts: conflicts,
          saveCallback: callback
        }
      },
      modal: {
        title: 'Merge pois',
        className: 'modal-lg',
        hasFooter: false
      }
    };
    this._dynamicModalService.showComponentModal(modalConfig);
  }
}
