export interface IHikeEditMapState {
  mapId: string;
  mode: string;
  bufferShown: boolean;
  geoJsonOnMap: L.GeoJSON
};

export const hikeEditMapDomain = 'hikeEditMap';
