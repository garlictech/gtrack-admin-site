import { IProviderInput } from './provider';

export interface ITrackSegment {
  trackId: string;
  segment: GeoJSON.LineString;
};

export interface ITrackStartData {
  hikeId: string;
  start: number;
};

export interface ITrackEndData {
  id: string;
  end: number;
}

export interface ITrack {
  hikeId: string;
  trackLine: GeoJSON.LineString;
  start: number;
  end: number;
};

export interface ITrackInput extends ITrack, IProviderInput {};
export interface ITrackStartInput extends ITrackStartData, IProviderInput {};
export interface ITrackEndInput extends ITrackEndData, IProviderInput {};

export interface ITrackSegmentInput extends ITrackSegment, IProviderInput {};

export interface ITrackStored extends ITrack {
  timestamp: number;
  id: string;
  userId: string;
};

export interface ITrackSegmentStored extends ITrackSegment {
  timestamp: number;
  id: string;
  userId: string;
};
