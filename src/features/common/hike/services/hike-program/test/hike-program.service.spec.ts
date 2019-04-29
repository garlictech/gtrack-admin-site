import { TestBed, async } from '@angular/core/testing';
import { DeepstreamService } from '@bit/garlictech.angular-features.common.deepstream-ngx';
import { HikeProgramStored } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

import { HikeProgramService } from '../hike-program.service';
import { hikeProgramsStored as hikeProgramFixtures } from '../../../testing/fixtures';

describe('HikeProgramService', () => {
  let hikePrograms: HikeProgramStored[];
  let service: HikeProgramService;

  beforeEach(() => {
    hikePrograms = [...hikeProgramFixtures];
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: DeepstreamService,
          useValue: {}
        },
        HikeProgramService
      ]
    });

    service = TestBed.get(HikeProgramService);
  });

  it('should reverse a hikeProgram', async(() => {
    const hikeProgram = hikePrograms[0];

    const reversed = service.reverse(hikeProgram);
    const start = reversed.stops[0];
    const finish = reversed.stops[reversed.stops.length - 1];

    expect(reversed.id).toEqual(hikeProgram.id);
    expect(reversed.reversed).toEqual(true);
    expect(reversed.uphill).toEqual(hikeProgram.downhill);
    expect(reversed.downhill).toEqual(hikeProgram.uphill);
    expect(reversed.score).toEqual(hikeProgram.reverseScore);
    expect(reversed.time).toEqual(hikeProgram.reverseTime);

    expect(start).toEqual(hikeProgram.reverseStops[0]);
    expect(finish).toEqual(hikeProgram.reverseStops[hikeProgram.reverseStops.length - 1]);
    expect(reversed.stops).toEqual(hikeProgram.reverseStops);
  }));

  it('should be symmetrical', async(() => {
    const hikeProgram = hikePrograms[0];
    const reversed = service.reverse(hikeProgram);
    const secondReversed = service.reverse(reversed);

    expect(secondReversed).toEqual({
      ...hikeProgram,
      reversed: false
    });
  }));
});
