// tslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';
import { SvgContent } from './state';

export enum ActionTypes {
  Reset = '[Marker icons] Reset',
  AddSvgIconContents = '[Marker icons] Add SVG icon contents',
  AddSvgMarkerContents = '[Marker icons] Add SVG marker contents'
}

export class Reset implements Action {
  readonly type = ActionTypes.Reset;
}

export class AddSvgIconContents implements Action {
  readonly type = ActionTypes.AddSvgIconContents;
  constructor(public svgContents: Array<SvgContent>) {}
}

export class AddSvgMarkerContents implements Action {
  readonly type = ActionTypes.AddSvgMarkerContents;
  constructor(public svgContents: Array<SvgContent>) {}
}

export type AllActions = Reset | AddSvgIconContents | AddSvgMarkerContents;
