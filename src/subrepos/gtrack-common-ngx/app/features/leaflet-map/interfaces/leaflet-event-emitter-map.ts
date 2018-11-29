import { EventEmitter } from '@angular/core';
import { LeafletMouseEvent } from 'leaflet';

export interface ILeafletEventEmitterMap {
  [eventName: string]: EventEmitter<LeafletMouseEvent>;
}
