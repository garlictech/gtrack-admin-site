export interface Segment {
  distance: number;
  uphill: number;
  downhill: number;
  coordinates: Array<Array<number>>;
  time?: number;
  score?: number;
}
