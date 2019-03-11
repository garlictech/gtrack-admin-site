import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type } from '@angular/core';
import { LeafletMarkerPopupData } from '../interfaces';

import * as L from 'leaflet';

import _cloneDeep from 'lodash-es/cloneDeep';

@Injectable({
  providedIn: 'root'
})
export class LeafletMarkerPopupService {
  onUserMarkerClick: any;
  private _compRef: ComponentRef<any>;

  constructor(
    private readonly _resolver: ComponentFactoryResolver,
    private readonly _appRef: ApplicationRef,
    private readonly _injector: Injector
  ) {
    // tslint:disable:no-string-literal
    this.onUserMarkerClick = (marker: L.Marker, popupData: LeafletMarkerPopupData, e: L.LeafletMouseEvent): void => {
      const factories = Array.from(this._resolver['_factories'].keys());
      const factoryClass = factories.find((x: any) => x.componentName === popupData.popupComponentName) as Type<any>;

      if (factoryClass) {
        const compFactory = this._resolver.resolveComponentFactory(factoryClass);
        this._compRef = compFactory.create(this._injector);

        // Pass params to the loaded component
        this._compRef.instance.data = _cloneDeep(popupData.data);
        this._compRef.instance.closePopup = () => {
          this._compRef.destroy();
          if (popupData.closeCallback) {
            popupData.closeCallback();
          }
        };

        // It's necessary for change detection within MapInfoWindow
        this._appRef['attachView'](this._compRef.hostView);
        this._compRef.onDestroy(() => {
          this._appRef['detachView'](this._compRef.hostView);
        });

        const div: HTMLDivElement = document.createElement('div');
        div.appendChild(this._compRef.location.nativeElement);

        // Timeout for waiting appendChild formatting
        setTimeout(() => {
          L.popup({
            offset: L.point(0, -30),
            minWidth: popupData.data.backgroundImages ? 250 : 205
          })
            .setLatLng(e.target.getLatLng())
            .setContent(div)
            .openOn(popupData.map);
        }, 150);
      }
    };
  }
}
