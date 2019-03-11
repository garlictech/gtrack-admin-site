export interface SearchFilters {
  radius: number;
  difficulty: [number, number];
  time: [number, number];
  length: [number, number];
  location: string;
  center: GeoJSON.Position;
}
