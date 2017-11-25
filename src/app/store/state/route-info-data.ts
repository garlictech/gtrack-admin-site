import { ISegment } from '../../../subrepos/gtrack-common-ngx';

export interface IRouteInfoDataState {
  segments: ISegment[];
  total: any;
  location: any;
  track: any;
};

export const routeInfoDataDomain = 'routeInfoData';
