/* OLD: Route */
import { AdminMap } from './admin-map';
import {
  RouteService,
  ISegment
} from '../../../../subrepos/gtrack-common-ngx/app';

export class RouteInfoData {
  public segments: ISegment[];
  public total: any;
  public location: any;
  public track: any;

  constructor(private _routeService: RouteService) {
    this.segments = [];
    this.total = {};
    this.location = '';
    this.track = {};
  }

  /*
  public addTrack(track: GeoJSON.FeatureCollection<any>) {
    console.log('RouteInfoData.addTrack', track);
    this.track = track;
    this.track.bounds = this._routeService.getBounds(track);
  }


  public pushSegment(s: ISegment) {
    console.log('RouteInfoData.pushSegment', s);
    if (s) {
      this.segments.push(s);
      this._calculateTotal();
    }
  }

  */
  /*
  public popSegment() {
    console.log('RouteInfoData.popSegment');
    this.segments.pop();
    this._calculateTotal();
  }
  */

  public setLocation(location) {
    console.log('RouteInfoData.setLocation', location);
    this.location = location;
  }

  /**
   * Calculate segments total
   */
  private _calculateTotal() {
    this.total = {};

    for (let segment of this.segments) {
      for (let key in segment) {
        if (!this.total[key]) {
          this.total[key] = 0;
        }
        this.total[key] += segment[key];
      }
    }
  }
}
