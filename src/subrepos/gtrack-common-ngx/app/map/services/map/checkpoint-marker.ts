import * as L from 'leaflet';
import * as _ from 'lodash';

import { Checkpoint } from '../../../hike/services/checkpoint';
import { Poi } from '../../../hike/services/poi';
import { IconService } from '../icon';
import { IHikeProgramStop } from '../../../../../provider-client';

export class CheckpointMarker {
  public markers: { [key: string]: L.Marker } = {};
  public shownOnMap = false;
  public checkpoints: Checkpoint[] = [];

  constructor(protected map: L.Map, private iconService: IconService) {}

  public showMarkers(checkpoints: Checkpoint[], show = true) {
    if (checkpoints) {
      this.shownOnMap = show;

      checkpoints
        .map(checkpoint => this.markers[checkpoint.id])
        .filter(marker => typeof marker !== 'undefined')
        .forEach(marker => marker.setOpacity(this.opacity));
    }
  }

  public removeCheckpointMarkers() {
    _.each(this.markers, marker => this.map.removeLayer(marker));
    this.markers = {};
  }

  public addCheckpointMarkers(checkpoints: Checkpoint[]) {
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

  protected addRegularMarker(checkpoint: Checkpoint) {
    const stop = checkpoint.stop;

    const marker = new L.Marker([stop.lat, stop.lon], {
      icon: this.getIcon(stop),
      opacity: this.opacity,
      title: checkpoint.name
    });

    marker.addTo(this.map);
    this.markers[checkpoint.id] = marker;
  }

  public setActive(active: Checkpoint) {
    let reached = false;

    this.checkpoints.forEach((checkpoint, index) => {
      let type = 'grey';
      let icon: L.Icon;

      // Completed checkpoints
      if (reached === false) {
        type = 'green';

        // Current checkpoint
        if (checkpoint.index === active.index) {
          reached = true;
          type = 'red';
        }
      }

      icon = this.getIcon(checkpoint.stop, type);
      const marker = this.markers[checkpoint.id];

      if (marker) {
        marker.setIcon(icon);
      }
    });
  }

  protected addLastRoundtripMarker(checkpoint: Checkpoint) {
    this.markers[checkpoint.id] = this.markers[0];
  }

  protected getIcon(segment: IHikeProgramStop, type = 'default'): L.Icon {
    let icon = 'checkpoint';

    if (segment.isStart && segment.isFinish) {
      icon = 'startfinish';
    } else if (segment.isStart) {
      icon = 'start';
    } else if (segment.isFinish) {
      icon = 'finish';
    }

    return this.iconService.getLeafletIcon(icon, type);
  }

  protected get opacity(): number {
    return this.shownOnMap === true ? 1 : 0;
  }
}
