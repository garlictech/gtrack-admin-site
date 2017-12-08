import { Observable } from 'rxjs';

import { HikeProgramService, HikeProgram } from '../hike-program';
import { IHike, IHikeBackgroundImage } from './ihike';
import { IHikeDescription } from './ihike-description';

export class Hike implements IHike {
  public id: string;
  public distance: number;
  public uphill: number;
  public downhill: number;
  public time: number;
  public score: number;
  public location: string;
  public difficulty: string;
  public rate: string;
  public routeIcon: string;
  public elevationIcon: string;
  public routeId: string;
  public program: HikeProgram;
  public description: IHikeDescription;
  public backgroundImageUrls?: [IHikeBackgroundImage];
  public offlineMap: string;

  private observable: Observable<Hike>;

  private locale = 'en_US';

  constructor(data: IHike, private hikeProgramService: HikeProgramService) {
    Object.assign(this, data);
  }

  public get name(): string {
    return this.description[this.locale].name;
  }

  public get fullDescription(): string {
    return this.description[this.locale].full;
  }

  public get summary(): string {
    return this.description[this.locale].summary;
  }

  load(): Observable<Hike> {
    if (!this.observable) {
      this.observable = Observable
        .forkJoin([
          this.getHikeProgram(),
        ])
        .switchMap(() => {
          return Observable.of(this);
        });
    }

    return this.observable;
  }

  private getHikeProgram(): Observable<HikeProgram> {
    return this.hikeProgramService
      .get(this.program)
      .do((program: HikeProgram) => this.program = program)
      .do((program: HikeProgram) => this.calculatePhysicalValues(program));
  }

  private calculatePhysicalValues(program: HikeProgram): void {
    this.distance = program.fullDistance;
    this.uphill = program.uphill;
    this.downhill = program.downhill;
    this.score = program.score;
    this.time = program.time;
  }

}
