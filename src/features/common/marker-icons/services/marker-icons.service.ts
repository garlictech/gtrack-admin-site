import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { SVG_ICONS } from '../assets/icons';
import { SVG_MARKERS } from '../assets/markers';
import { EIconStyle } from '../enums';
import { markerIconsActions } from '../store';
import * as markerIconSelectors from '../store/selectors';
import { SvgContent } from '../store/state';

@Injectable({
  providedIn: 'root'
})
export class MarkerIconsService {
  constructor(private readonly _store: Store<any>) {}

  init(): void {
    const iconContents: Array<SvgContent> = [];
    const markerContents: Array<SvgContent> = [];

    Object.keys(SVG_ICONS).forEach((type: string) => {
      iconContents.push({
        id: type,
        content: SVG_ICONS[type]
      });
    });

    Object.keys(SVG_MARKERS).forEach((type: string) => {
      markerContents.push({
        id: type,
        content: SVG_MARKERS[type]
      });
    });

    setTimeout(() => {
      this._store.dispatch(new markerIconsActions.AddSvgIconContents(iconContents));
      this._store.dispatch(new markerIconsActions.AddSvgMarkerContents(markerContents));
    });
  }

  getIcon(type: string, encoded: boolean, iconStyle: EIconStyle = EIconStyle.DEFAULT): string {
    let content = '';
    this._store
      .pipe(
        select(markerIconSelectors.getIcon(type, encoded, iconStyle)),
        take(1)
      )
      .subscribe((iconContent: string) => {
        content = iconContent;
      });

    return content;
  }

  getMarker(type: string, encoded: boolean, iconStyle: EIconStyle = EIconStyle.DEFAULT): string {
    let content = '';
    this._store
      .pipe(
        select(markerIconSelectors.getMarker(type, encoded, iconStyle)),
        take(1)
      )
      .subscribe((markerContent: string) => {
        content = markerContent;
      });

    return content;
  }
}
