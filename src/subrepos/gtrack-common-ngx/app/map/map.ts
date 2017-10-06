import { Route } from '../route';
import { IconService } from '../icon';

import { CurrentPositionMarker } from './current-position-marker';
import { CheckpointMarker } from './checkpoint-marker';
import { PointMarker } from './point-marker';

import { MapMarkerService } from '../map-marker';

export class Map {
  protected _currentPositionMarker: CurrentPositionMarker;
  protected _checkpointMarker: CheckpointMarker;
  protected _pointMarker: PointMarker;

  constructor(protected map: L.Map, private iconService: IconService, private mapMarkerService: MapMarkerService) {}

  public get currentPositionMarker(): CurrentPositionMarker {
    if (!this._currentPositionMarker) {
      this._currentPositionMarker = new CurrentPositionMarker(this.map);
    }

    return this._currentPositionMarker;
  }

  public get checkpointMarker(): CheckpointMarker {
    if (!this._checkpointMarker) {
      this._checkpointMarker = new CheckpointMarker(this.map, this.iconService);
    }

    return this._checkpointMarker;
  }

  public get pointMarker(): PointMarker {
    if (!this._pointMarker) {
      this._pointMarker = new PointMarker(this.map, this.mapMarkerService);
    }

    return this._pointMarker;
  }

  public get leafletMap(): L.Map {
    return this.map;
  }

  public getBounds(route: Route): L.LatLngBoundsExpression {
    let bounds = route.bounds;

    return [
      [bounds.NorthEast.lat, bounds.NorthEast.lon],
      [bounds.SouthWest.lat, bounds.SouthWest.lon]
    ];
  }

  public fitBox(box: L.LatLngBoundsExpression) {
    this.map.invalidateSize();

    return this.map.fitBounds(box, {
      padding: [50, 50]
    });
  }

  public fitBounds(route: Route) {
    return this.fitBox(this.getBounds(route));
  }

}
