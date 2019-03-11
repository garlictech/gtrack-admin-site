export interface PositionData {
  lat: number;
  lng: number;
}

export interface Locatable {
  positions?: Array<PositionData>;
}
