import { IPoi } from 'subrepos/gtrack-common-ngx';

export interface IExternalPoi extends IPoi {
  inGtrackDb?: boolean | undefined;
  onRoute?: boolean | undefined;
  distFromRoute?: number | undefined;
}
