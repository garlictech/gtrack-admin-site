export interface IPositionData {
  lat: number;
  lng: number;
};

export interface ILocatable {
  positions?: IPositionData[];
}
