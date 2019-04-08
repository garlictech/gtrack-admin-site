import * as L from 'leaflet';

import { TestBed } from '@angular/core/testing';
import { EIconStyle } from '@bit/garlictech.angular-features.common.marker-icons/enums';

import { LeafletIconService } from '../../leaflet-icon.service';
import { LeafletMapMarker } from '../leaflet-map-marker';

describe('LeafletMapMarker', () => {
  let leafletMapMarker: LeafletMapMarker;
  let leafletIconService: LeafletIconService;
  let mapElement: HTMLDivElement;
  let lMap: L.Map;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LeafletIconService,
          useValue: {
            getLeafletIcon: jest.fn(() => 1)
          }
        }
      ]
    });

    leafletIconService = TestBed.get(LeafletIconService);
    mapElement = document.createElement('div');
    lMap = L.map(mapElement);
  });

  it('should be created', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);
    expect(leafletMapMarker).toBeTruthy();
    expect(leafletMapMarker.marker).toBeInstanceOf(L.Marker);
  });

  it('should open popup', () => {
    const popupData = {
      popupComponentName: 'FakePopup',
      markerClickCallback: jest.fn(),
      closeCallback: jest.fn(),
      map: lMap,
      data: {}
    };

    const popupSpy = jest.spyOn(popupData, 'markerClickCallback');

    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, popupData);

    leafletMapMarker.marker.fireEvent('click');

    expect(popupSpy).toHaveBeenCalled();
  });

  it('should toggle highlight', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);

    (leafletMapMarker as any)._highlighted = false;

    const iconSpy = jest.spyOn(leafletMapMarker.marker, 'setIcon');

    const highlightIcon = leafletIconService.getLeafletIcon('cafe', EIconStyle.HIGHLIGHTED);
    leafletMapMarker.toggleHighlight();
    expect((leafletMapMarker as any)._highlighted).toBeTruthy();
    expect(iconSpy).toBeCalledWith(highlightIcon);

    const defaultIcon = leafletIconService.getLeafletIcon('cafe', EIconStyle.DEFAULT);
    leafletMapMarker.toggleHighlight();
    expect((leafletMapMarker as any)._highlighted).toBeFalsy();
    expect(iconSpy).toBeCalledWith(defaultIcon);
  });

  it('should add to map', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);

    const addSpy = jest.spyOn(leafletMapMarker.marker, 'addTo');
    const fireSpy = jest.spyOn(lMap, 'fire');

    leafletMapMarker.addToMap(lMap);

    expect(addSpy).toHaveBeenCalledWith(lMap);

    leafletMapMarker.marker.fireEvent('click');

    expect(fireSpy).toHaveBeenCalled();
  });

  it('should remove from map', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);

    const removeSpy = jest.spyOn(leafletMapMarker.marker, 'removeFrom');

    leafletMapMarker.removeFromMap(lMap);
    expect(removeSpy).toHaveBeenCalledWith(lMap);
  });

  it('should get highlighted value with getter', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);

    const highlighted = leafletMapMarker.highlighted;

    expect(highlighted).toEqual((leafletMapMarker as any)._highlighted);
  });

  it('should get coordinates value with getter', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, undefined);

    const coordinates = leafletMapMarker.coordinates;

    expect(coordinates).toEqual(L.latLng(10, 10));
  });
});
