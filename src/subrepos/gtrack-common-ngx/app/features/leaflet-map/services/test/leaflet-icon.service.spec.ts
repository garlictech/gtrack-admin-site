import { TestBed } from '@angular/core/testing';
import { LeafletIconService } from '../leaflet-icon.service';

import * as L from 'leaflet';

describe('LeafletIconService', () => {
  let leafletIconService: LeafletIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LeafletIconService
      ]
    });

    leafletIconService = TestBed.get(LeafletIconService);
  });

  it('should be created', () => {
    expect(leafletIconService).toBeTruthy();
  });

  it('should get icon file', () => {
    const defaultIcon = leafletIconService.url('bank', 'default');
    const greenIcon = leafletIconService.url('bank', 'green');
    const greyIcon = leafletIconService.url('bank', 'grey');
    const highlightIcon = leafletIconService.url('bank', 'highlight');
    const redIcon = leafletIconService.url('bank', 'red');

    expect(defaultIcon).toEqual('test-file-stub');
    expect(greenIcon).toEqual('test-file-stub');
    expect(greyIcon).toEqual('test-file-stub');
    expect(highlightIcon).toEqual('test-file-stub');
    expect(redIcon).toEqual('test-file-stub');
  });

  it('should get icon files', () => {
    const defaultIcons = leafletIconService.urls(['bank', 'cafe'], 'default');
    const greenIcons = leafletIconService.urls(['bank', 'cafe'], 'green');
    const greyIcons = leafletIconService.urls(['bank', 'cafe'], 'grey');
    const highlightIcons = leafletIconService.urls(['bank', 'cafe'], 'highlight');
    const redIcons = leafletIconService.urls(['bank', 'cafe'], 'red');

    expect(defaultIcons).toEqual(['test-file-stub', 'test-file-stub']);
    expect(greenIcons).toEqual(['test-file-stub', 'test-file-stub']);
    expect(greyIcons).toEqual(['test-file-stub', 'test-file-stub']);
    expect(highlightIcons).toEqual(['test-file-stub', 'test-file-stub']);
    expect(redIcons).toEqual(['test-file-stub', 'test-file-stub']);
  });

  it('should get leaflet icons', () => {
    const icon = leafletIconService.getLeafletIcon('bank', 'default');

    expect(icon).toBeInstanceOf(L.Icon);
  });
});
