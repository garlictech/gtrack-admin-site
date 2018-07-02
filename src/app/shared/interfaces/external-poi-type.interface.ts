import { EPoiTypes } from 'subrepos/provider-client';

export interface IExternalPoiType {
  title: string;
  subdomain: EPoiTypes;
  getAction: string;
  typeParam?: string;
}
