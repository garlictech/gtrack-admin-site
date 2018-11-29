export interface ILeafletMarkerPopupData {
  popupComponentName: string;
  markerClickCallback: any;
  closeCallback: any;
  map: L.Map;
  data: any;
}
