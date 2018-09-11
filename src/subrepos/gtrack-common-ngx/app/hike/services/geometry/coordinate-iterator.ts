import * as _ from 'lodash';

export class CoordinateIterator {
  protected index = 0;
  protected loop = false;
  protected _coordinates: GeoJSON.Position[];

  public constructor(coordinates: GeoJSON.Position[]) {
    this.coordinates = coordinates;
    this.start();
  }

  public set coordinates(coordinates: GeoJSON.Position[]) {
    this._coordinates = coordinates;
    this.loop = this.isLoop();
  }

  public get coordinates(): GeoJSON.Position[] {
    return this._coordinates;
  }

  public start(index = 0): GeoJSON.Position {
    this.index = index;

    return this.coordinates[index] || null;
  }

  public next(): GeoJSON.Position | null {
    let next: GeoJSON.Position | null = null;

    if (this.coordinates) {
      this.index++;
      next = this.coordinates[this.index] || null;

      if (this.index === this.coordinates.length - 1 && this.loop === true) {
        next = this.start();
      }
    }

    return next;
  }

  public at(): number {
    return this.index;
  }

  public end(): boolean {
    return this.index >= this.coordinates.length;
  }

  protected isLoop(): boolean {
    let isLoop = false;
    const round = (numbers: number[]): number[] => {
      return numbers.map((n: number) => _.round(n, 6));
    };

    const first = _.first(this.coordinates);
    const last = _.last(this.coordinates);

    if (first && last) {
      isLoop = _.isEqual(round(first), round(last));
    }

    return isLoop;
  }
}
