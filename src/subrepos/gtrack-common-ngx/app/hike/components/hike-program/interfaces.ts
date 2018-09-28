import { IPoi, IHikeProgramStop } from 'subrepos/provider-client';

export interface IHikeProgramOutline {
  poi: IPoi;
  stop: IHikeProgramStop;
  name: string;
  distanceFromOrigo: number;
  toNextStop: number;
}
