import { SvgIconRegistryService } from 'angular-svg-icon';
import { forkJoin, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { DEFAULT_COLOR_MAP, EIconStyle } from '../enums';
import { markerIconsActions } from '../store';
import * as markerIconSelectors from '../store/selectors';
import { SvgContent } from '../store/state';

@Injectable({
  providedIn: 'root'
})
export class MarkerIconService {
  constructor(private readonly _store: Store<any>, private readonly _iconReg: SvgIconRegistryService) {
    const iconLoaders = [];
    const markerLoaders = [];

    Object.keys(DEFAULT_COLOR_MAP).forEach((type: string) => {
      iconLoaders.push(
        this._iconReg.loadSvg(`/assets/icon/${type}.svg`).pipe(
          switchMap((svg: SVGElement) =>
            of({
              id: type,
              content: svg.outerHTML
            })
          )
        )
      );

      markerLoaders.push(
        this._iconReg.loadSvg(`/assets/marker/${type}.svg`).pipe(
          switchMap((svg: SVGElement) =>
            of({
              id: type,
              content: svg.outerHTML
            })
          )
        )
      );
    });

    forkJoin(iconLoaders).subscribe((svgContents: Array<SvgContent>) => {
      this._store.dispatch(new markerIconsActions.AddSvgIconContents(svgContents));
    });

    forkJoin(markerLoaders).subscribe((svgContents: Array<SvgContent>) => {
      this._store.dispatch(new markerIconsActions.AddSvgMarkerContents(svgContents));
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
