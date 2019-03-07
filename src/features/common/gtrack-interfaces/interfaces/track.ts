import { ProviderInput } from './provider';

export interface TrackSegment {
  trackId: string;
  segment: GeoJSON.LineString;
}

export interface TrackStartData {
  hikeId: string;
  start: number;
}

export interface TrackEndData {
  id: string;
  end: number;
}

export interface Track {
  hikeId: string;
  trackLine: GeoJSON.LineString;
  start: number;
  end: number;
}

export interface TrackInput extends Track, ProviderInput {}
export interface TrackStartInput extends TrackStartData, ProviderInput {}
export interface TrackEndInput extends TrackEndData, ProviderInput {}

export interface TrackSegmentInput extends TrackSegment, ProviderInput {}

export interface TrackStored extends Track {
  timestamp: number;
  id: string;
  userId: string;
}

export interface TrackSegmentStored extends TrackSegment {
  timestamp: number;
  id: string;
  userId: string;
}
