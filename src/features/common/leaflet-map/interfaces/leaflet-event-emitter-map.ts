import { EventEmitter } from '@angular/core';
import { LeafletMouseEvent } from 'leaflet';

export interface LeafletEventEmitterMap {
  [eventName: string]: EventEmitter<LeafletMouseEvent>;
}
