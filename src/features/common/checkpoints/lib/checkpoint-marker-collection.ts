import * as L from 'leaflet';
import _each from 'lodash-es/each';

import { HikeProgramStop } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { LeafletIconService } from '@bit/garlictech.angular-features.common.leaflet-map';
import { EIconStyle } from '@bit/garlictech.angular-features.common.marker-icons';

import { Checkpoint } from './checkpoint';

export class CheckpointMarkerCollection {
  markers: { [key: string]: L.Marker };
  shownOnMap: boolean;
  checkpoints: Array<Checkpoint>;

  constructor(protected map: L.Map, private readonly iconService: LeafletIconService) {
    this.markers = {};
    this.shownOnMap = false;
    this.checkpoints = [];
  }

  showMarkers(checkpoints: Array<Checkpoint>, show = true): void {
    if (checkpoints) {
      this.shownOnMap = show;

      checkpoints
        .map(checkpoint => this.markers[checkpoint.id])
        .filter(marker => typeof marker !== 'undefined')
        .forEach(marker => marker.setOpacity(this.opacity));
    }
  }

  removeCheckpointMarkers(): void {
    _each(this.markers, marker => this.map.removeLayer(marker));
    this.markers = {};
  }

  addCheckpointMarkers(checkpoints: Array<Checkpoint>): void {
    checkpoints.forEach((checkpoint, i) => {
      const stop = checkpoint.stop;

      if (stop.isStart && stop.isFinish && i === checkpoints.length - 1) {
        this.addLastRoundtripMarker(checkpoint);
      } else {
        this.addRegularMarker(checkpoint);
      }

      this.checkpoints.push(checkpoint);
    });
  }

  protected addRegularMarker(checkpoint: Checkpoint): void {
    const stop = checkpoint.stop;

    const marker = new L.Marker([stop.lat, stop.lon], {
      icon: this.getIcon(stop),
      opacity: this.opacity,
      zIndexOffset: 1500,
      title: checkpoint.name
    });

    marker.addTo(this.map);
    this.markers[checkpoint.id] = marker;
  }

  setActive(active: Checkpoint): void {
    let reached = false;

    this.checkpoints.forEach((checkpoint, index) => {
      let type: EIconStyle = EIconStyle.GREY;
      let icon: L.Icon;

      // Completed checkpoints
      if (!reached) {
        type = EIconStyle.GREEN;

        // Current checkpoint
        if (checkpoint.index === active.index) {
          reached = true;
          type = EIconStyle.RED;
        }
      }

      icon = this.getIcon(checkpoint.stop, type);
      const marker = this.markers[checkpoint.id];

      if (marker) {
        marker.setIcon(icon);
      }
    });
  }

  protected addLastRoundtripMarker(checkpoint: Checkpoint): void {
    this.markers[checkpoint.id] = this.markers[0];
  }

  protected getIcon(segment: HikeProgramStop, iconStyle: EIconStyle = EIconStyle.DEFAULT): L.Icon {
    let icon = 'checkpoint';

    if (segment.isStart && segment.isFinish) {
      icon = 'startfinish';
    } else if (segment.isStart) {
      icon = 'start';
    } else if (segment.isFinish) {
      icon = 'finish';
    }

    return this.iconService.getLeafletIcon(icon, iconStyle);
  }

  protected get opacity(): number {
    return this.shownOnMap ? 1 : 0;
  }
}
