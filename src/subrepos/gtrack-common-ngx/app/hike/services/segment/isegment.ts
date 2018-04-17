export interface ISegment {
  distance: number;
  uphill: number;
  downhill: number;
  coordinates: number[][];
  time?: number;
  score?: number;
}
