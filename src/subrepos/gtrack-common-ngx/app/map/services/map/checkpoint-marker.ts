import * as L from 'leaflet';

import { Checkpoint } from '../../../hike/services/checkpoint';
import { Poi } from '../../../hike/services/poi';
import { IconService } from '../icon';

export class CheckpointMarker {
  public markers: L.Marker[] = [];
  public shownOnMap = false;
  public checkpoints: Checkpoint[] = [];

  constructor(protected map: L.Map, private iconService: IconService) {}

  public showMarkers(checkpoints: Checkpoint[], show = true) {
    if (checkpoints) {
      this.shownOnMap = show;
      checkpoints.forEach(checkpoint => checkpoint.marker.setOpacity(this.opacity));
    }
  }

  public removeCheckpointMarkers() {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
  }

  public addCheckpointMarkers(checkpoints: Checkpoint[]) {
    checkpoints.forEach((checkpoint, i) => {
      let poi = checkpoint.poi;

      if (poi.isStart && poi.isFinish && i === checkpoints.length - 1) {
        this.addLastRoundtripMarker(checkpoint);
      } else {
        this.addRegularMarker(checkpoint);
      }

      this.checkpoints.push(checkpoint);
    });
  }

  protected addRegularMarker(checkpoint: Checkpoint) {
    let poi = checkpoint.poi;
    let marker = new L.Marker([poi.lat, poi.lon], {
      icon: this.getIcon(poi),
      opacity: this.opacity,
      title: checkpoint.name
    });

    marker.addTo(this.map);
    checkpoint.marker = marker;
    this.markers.push(marker);
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

      icon = this.getIcon(checkpoint.poi, type);
      checkpoint.marker.setIcon(icon);
    });
  }

  protected addLastRoundtripMarker(checkpoint: Checkpoint) {
    checkpoint.marker = this.markers[0];
  }

  protected getIcon(poi: Poi, type = 'default'): L.Icon {
    let icon = 'checkpoint';

    if (poi.isStart && poi.isFinish) {
      icon = 'startfinish';
    } else if (poi.isStart) {
      icon = 'start';
    } else if (poi.isFinish) {
      icon = 'finish';
    }

    return this.iconService.getLeafletIcon(icon, type);
  }

  protected get opacity(): number {
    return (this.shownOnMap === true) ? 1 : 0;
  }
}
