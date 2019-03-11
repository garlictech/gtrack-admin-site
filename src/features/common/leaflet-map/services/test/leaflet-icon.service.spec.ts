import { TestBed } from '@angular/core/testing';
import { LeafletIconService } from '../leaflet-icon.service';

import * as L from 'leaflet';

describe('LeafletIconService', () => {
  let leafletIconService: LeafletIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletIconService]
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

    expect(defaultIcon).toEqual('/assets/poi-icons/default/bank.png');
    expect(greenIcon).toEqual('/assets/poi-icons/green/bank.png');
    expect(greyIcon).toEqual('/assets/poi-icons/grey/bank.png');
    expect(highlightIcon).toEqual('/assets/poi-icons/highlight/bank.png');
    expect(redIcon).toEqual('/assets/poi-icons/red/bank.png');
  });

  it('should get icon files', () => {
    const defaultIcons = leafletIconService.urls(['bank', 'cafe'], 'default');
    const greenIcons = leafletIconService.urls(['bank', 'cafe'], 'green');
    const greyIcons = leafletIconService.urls(['bank', 'cafe'], 'grey');
    const highlightIcons = leafletIconService.urls(['bank', 'cafe'], 'highlight');
    const redIcons = leafletIconService.urls(['bank', 'cafe'], 'red');

    expect(defaultIcons).toEqual(['/assets/poi-icons/default/bank.png', '/assets/poi-icons/default/cafe.png']);
    expect(greenIcons).toEqual(['/assets/poi-icons/green/bank.png', '/assets/poi-icons/green/cafe.png']);
    expect(greyIcons).toEqual(['/assets/poi-icons/grey/bank.png', '/assets/poi-icons/grey/cafe.png']);
    expect(highlightIcons).toEqual(['/assets/poi-icons/highlight/bank.png', '/assets/poi-icons/highlight/cafe.png']);
    expect(redIcons).toEqual(['/assets/poi-icons/red/bank.png', '/assets/poi-icons/red/cafe.png']);
  });

  it('should get leaflet icons', () => {
    const icon = leafletIconService.getLeafletIcon('bank', 'default');

    expect(icon).toBeInstanceOf(L.Icon);
  });
});
