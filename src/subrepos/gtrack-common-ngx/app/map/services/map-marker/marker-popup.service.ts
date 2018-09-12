import { Injectable, ComponentFactoryResolver, ComponentRef, Type, Injector, ApplicationRef } from '@angular/core';
import { IMarkerPopupData } from '../../../../../provider-client';
import * as L from 'leaflet';
import * as _ from 'lodash';

@Injectable()
export class MarkerPopupService {
  private _compRef: ComponentRef<any>;

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector
  ) {}

  /* tslint:disable:no-string-literal */
  public onUserMarkerClick = (marker: L.Marker, popupData: IMarkerPopupData, e: L.LeafletMouseEvent) => {
    const factories = Array.from(this._resolver['_factories'].keys());
    const factoryClass = <Type<any>>factories.find((x: any) => {
      return x.componentName === popupData.popupComponentName;
    });

    if (factoryClass === null) {
      console.log(`factoryClass for component name "${popupData.popupComponentName}" not found.`);
    } else {
      const compFactory = this._resolver.resolveComponentFactory(factoryClass);
      this._compRef = compFactory.create(this._injector);

      // Pass params to the loaded component
      this._compRef.instance.data = _.cloneDeep(popupData.data);
      this._compRef.instance.closePopup = () => {
        this._compRef.destroy();
        popupData.closeCallback();
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
    /* tslint:enable:no-string-literal */
  };
}
