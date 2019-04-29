import { HikeProgramStop, PoiData } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface HikeProgramOutline {
  poi: PoiData;
  stop: HikeProgramStop;
  name: string;
  distanceFromOrigo: number;
  toNextStop: number;
}
