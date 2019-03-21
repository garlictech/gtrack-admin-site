import { Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Injectable()
export class MarkerIconService {
  constructor(private readonly _iconReg: SvgIconRegistryService) {}

  getInlineSvg(path: string): any {
    console.log('PATH', path);
    this._iconReg.loadSvg(path).subscribe((element: SVGElement) => {
      console.log('element', element);
    });
  }
}
