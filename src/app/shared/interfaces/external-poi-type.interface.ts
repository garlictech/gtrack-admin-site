import { EPoiTypes } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface ExternalPoiType {
  title: string;
  subdomain: EPoiTypes;
  getAction: string;
  typeParam?: string;
}
