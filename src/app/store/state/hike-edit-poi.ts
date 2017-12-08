import { IExternalPoi } from 'app/shared/interfaces/index';

export interface IHikeEditPoiState {
  wikipedia: {
    pois: IExternalPoi[],
    loading: boolean,
    showOnrouteMarkers: boolean,
    showOffrouteMarkers: boolean
  },
  google: {
    pois: IExternalPoi[],
    loading: boolean,
    showOnrouteMarkers: boolean,
    showOffrouteMarkers: boolean
  },
  osmNatural: {
    pois: IExternalPoi[],
    loading: boolean,
    showOnrouteMarkers: boolean,
    showOffrouteMarkers: boolean
  },
  osmAmenity: {
    pois: IExternalPoi[],
    loading: boolean,
    showOnrouteMarkers: boolean,
    showOffrouteMarkers: boolean
  },
  osmRoute: {
    pois: IExternalPoi[],
    loading: boolean,
    showOnrouteMarkers: boolean,
    showOffrouteMarkers: boolean
  },
};
