import { LeafletMapConfig } from '../interfaces';

export const DEFAULT_LAYERS = [
  {
    name: 'street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  }
];

export const DEFAULT_OVERLAY_LAYERS = [
  {
    name: 'trails',
    url: 'http://tile.lonvia.de/hiking/{z}/{x}/{y}.png'
  }
];

export const DEFAULT_LEAFLET_MAP_CONFIG: LeafletMapConfig = {
  spiderfier: false
};
