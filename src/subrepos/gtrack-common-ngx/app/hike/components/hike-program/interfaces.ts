import { HikeProgramStop, PoiData } from '@features/common/gtrack-interfaces';

export interface HikeProgramOutline {
  poi: PoiData;
  stop: HikeProgramStop;
  name: string;
  distanceFromOrigo: number;
  toNextStop: number;
}
