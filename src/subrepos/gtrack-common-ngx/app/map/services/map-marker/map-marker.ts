import { IconService } from '../icon';
import { IMarkerPopupData } from '../../../../../provider-client/interfaces';

import * as L from 'leaflet';

export class MapMarker {
  public marker: L.Marker;
  protected _highlighted = false;

  constructor(
    lat: number,
    lon: number,
    protected types: Array<string>,
    title: string,
    protected iconService: IconService,
    popupData: IMarkerPopupData
  ) {
    this.marker = new L.Marker([lat, lon], {
      icon: iconService.getLeafletIcon(types),
      title: title
    });

    this.marker.on('click', e => {
      if (popupData) {
        popupData.markerClickCallback(this.marker, popupData, e);
      }
    });
  }

  public toggleHighlight() {
    let iconType = 'default';

    this._highlighted = !this._highlighted;

    if (this._highlighted === true) {
      iconType = 'highlight';
    }

    this.marker.setIcon(this.iconService.getLeafletIcon(this.types, iconType));
  }

  public addToMap(map: L.Map): void {
    this.marker.addTo(map);
  }

  public removeFromMap(map: L.Map): void {
    this.marker.removeFrom(map);
  }

  public get highlighted() {
    return this._highlighted;
  }

  public get coordinates(): L.LatLng {
    let latlng = this.marker.getLatLng();

    return latlng;
  }

  /*
  private _onMarkerClick(marker: L.Marker, cacheId: string, e: any): void {
    if (this._compRef) {
      this._compRef.destroy();
    }

    // Dynamically creation component, MapInfoWindow should be declared in entryComponents
    const compFactory: ComponentFactory<MapInfoWindow> = this._resolver.resolveComponentFactory(MapInfoWindow);
    this._compRef = compFactory.create(this._injector);

    // Add data
    this._compRef.instance.cacheId = cacheId;
    this._compRef.instance.marker = marker;
    this._compRef.instance.maptype = EMapIds.MAIN_MAP;

    // It's necessary for change detection within MapInfoWindow
    this._appRef['attachView'](this._compRef.hostView);
    this._compRef.onDestroy(() => {
      this._appRef['detachView'](this._compRef.hostView);
    });

    const div: HTMLDivElement = document.createElement('div');
    div.appendChild(this._compRef.location.nativeElement);

    // Timeout for waiting appendChild formatting
    setTimeout(() => {
      L.popup({ offset: L.point(0, -30) })
        .setLatLng(e.target.getLatLng())
        .setContent(div)
        .openOn(this._map);
    }, 150);
  }*/
}
