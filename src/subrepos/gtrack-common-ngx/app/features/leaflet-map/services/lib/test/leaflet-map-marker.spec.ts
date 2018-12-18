import { TestBed } from '@angular/core/testing';
import { LeafletMapMarker } from '../leaflet-map-marker';
import { LeafletIconService } from '../../leaflet-icon.service';

import * as L from 'leaflet';

describe('LeafletMapMarker', () => {
  let leafletMapMarker: LeafletMapMarker;
  let leafletIconService: LeafletIconService;
  let mapElement: HTMLDivElement;
  let map: L.Map;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LeafletIconService,
          useValue: {
            getLeafletIcon: jest.fn(() => 1)
          }
        }
      ]
    });

    leafletIconService = TestBed.get(LeafletIconService);
    mapElement = document.createElement('div');
    map = L.map(mapElement);
  });

  it('should be created', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);
    expect(leafletMapMarker).toBeTruthy();
    expect(leafletMapMarker.marker).toBeInstanceOf(L.Marker);
  });

  it('should open popup', () => {
    const popupData = {
      popupComponentName: 'FakePopup',
      markerClickCallback: jest.fn(),
      closeCallback: jest.fn(),
      map: map,
      data: {}
    };

    const popupSpy = jest.spyOn(popupData, 'markerClickCallback');

    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, popupData);

    leafletMapMarker.marker.fireEvent('click');

    expect(popupSpy).toHaveBeenCalled();
  });

  it('should toggle highlight', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);

    leafletMapMarker['_highlighted'] = false;

    const iconSpy = jest.spyOn(leafletMapMarker.marker, 'setIcon');

    const highlightIcon = leafletIconService.getLeafletIcon('cafe', 'highlight');
    leafletMapMarker.toggleHighlight();
    expect(leafletMapMarker['_highlighted']).toBeTruthy();
    expect(iconSpy).toBeCalledWith(highlightIcon);

    const defaultIcon = leafletIconService.getLeafletIcon('cafe', 'default');
    leafletMapMarker.toggleHighlight();
    expect(leafletMapMarker['_highlighted']).toBeFalsy();
    expect(iconSpy).toBeCalledWith(defaultIcon);
  });

  it('should add to map', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);

    const addSpy = jest.spyOn(leafletMapMarker.marker, 'addTo');
    const fireSpy = jest.spyOn(map, 'fire');

    leafletMapMarker.addToMap(map);

    expect(addSpy).toHaveBeenCalledWith(map);

    leafletMapMarker.marker.fireEvent('click');

    expect(fireSpy).toHaveBeenCalled();
  });

  it('should remove from map', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);

    const removeSpy = jest.spyOn(leafletMapMarker.marker, 'removeFrom');

    leafletMapMarker.removeFromMap(map);
    expect(removeSpy).toHaveBeenCalledWith(map);
  });

  it('should get highlighted value with getter', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);

    const highlighted = leafletMapMarker.highlighted;

    expect(highlighted).toEqual(leafletMapMarker['_highlighted']);
  });

  it('should get coordinates value with getter', () => {
    leafletMapMarker = new LeafletMapMarker(10, 10, ['cafe'], 'Cafe', leafletIconService, {}, null);

    const coordinates = leafletMapMarker.coordinates;

    expect(coordinates).toEqual(L.latLng(10, 10));
  });
});
