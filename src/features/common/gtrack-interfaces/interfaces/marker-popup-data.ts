// TODO - removable, the new leaflet feature module contains the new interface
export interface MarkerPopupData {
  popupComponentName: string;
  markerClickCallback: any;
  closeCallback: any;
  map: L.Map;
  data: any;
}
