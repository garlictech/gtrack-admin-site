// tslint:disable:no-string-literal no-import-side-effect
import { TestBed } from '@angular/core/testing';
import { CurrentPositionMarker } from '../current-position-marker';

import * as L from 'leaflet';
import 'leaflet-usermarker';

describe('CurrentPositionMarker', () => {
  let currentPositionMarker: CurrentPositionMarker;
  let mapElement: HTMLDivElement;
  let map: L.Map;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    mapElement = document.createElement('div');
    map = L.map(mapElement);
  });

  it('should be created', () => {
    currentPositionMarker = new CurrentPositionMarker(map);
    expect(currentPositionMarker).toBeTruthy();
  });

  it('should stop positioning created', () => {
    currentPositionMarker = new CurrentPositionMarker(map);

    const pos = L.latLng(10, 10);
    currentPositionMarker['marker'] = L.userMarker(pos, {
      pulsing: true,
      smallIcon: true
    }).addTo(map);

    const removeSpy = jest.spyOn(map, 'removeLayer');

    currentPositionMarker.stopPositioning();

    expect(removeSpy).toHaveBeenCalled();
    expect(currentPositionMarker['marker']).toEqual(undefined);
  });

  it('should go to position', () => {
    currentPositionMarker = new CurrentPositionMarker(map);

    map.setView = jest.fn();
    const viewSpy = jest.spyOn(map, 'setView');

    currentPositionMarker.goToPosition(L.latLng(10, 10));

    expect(viewSpy).toHaveBeenCalled();
    expect(currentPositionMarker['marker']).toBeDefined();
  });
});
