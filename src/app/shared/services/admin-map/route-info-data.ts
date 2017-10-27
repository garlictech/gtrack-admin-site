/* OLD: Route */
import { AdminMap } from './admin-map';
import { RouteService } from '../../../../subrepos/gtrack-common-ngx/app/route';

export class RouteInfoData {
  public segments: any;
  private _total: any;
  private _location: any;
  private _track: any;

  constructor(private _routeService: RouteService) {
    this.segments = [];
    this._total = {};
    this._location = '';
    this._track = {};
  }

  public addTrack(t: any) {
    console.log('addTrack', t);
    this._track = t;
    this._track.bounds = this._routeService.getBounds(t);
  }

  public pushSegment(s) {
    if (s) {
      this.segments.push(s);
      this._calculateTotal();
    }
  }

  public popSegment() {
    this.segments.pop();
    this._calculateTotal();
  }

  private _setLocation(l) {
    this._location = l;
  }

  private _calculateTotal() {
    this._total = {};

    for (let segment of this.segments) {
      for (let key in segment) {
        if (!this._total[key]) {
          this._total[key] = 0;
        }
        this._total[key] += segment[key];
      }
    }
  }
}
