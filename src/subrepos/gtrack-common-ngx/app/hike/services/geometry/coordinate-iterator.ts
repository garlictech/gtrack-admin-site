import _first from 'lodash-es/first';
import _isEqual from 'lodash-es/isEqual';
import _last from 'lodash-es/last';
import _round from 'lodash-es/round';

export class CoordinateIterator {
  protected index: number;
  protected loop: boolean;
  protected _coordinates: Array<GeoJSON.Position>;

  constructor(coordinates: Array<GeoJSON.Position>) {
    this.coordinates = coordinates;
    this.start();

    this.index = 0;
    this.loop = false;
  }

  set coordinates(coordinates: Array<GeoJSON.Position>) {
    this._coordinates = coordinates;
    this.loop = this.isLoop();
  }

  get coordinates(): Array<GeoJSON.Position> {
    return this._coordinates;
  }

  start(index = 0): GeoJSON.Position {
    this.index = index;

    return this.coordinates[index] || undefined;
  }

  next(): GeoJSON.Position | undefined {
    let next: GeoJSON.Position | undefined;

    if (this.coordinates) {
      this.index++;
      next = this.coordinates[this.index] || undefined;

      if (this.index === this.coordinates.length - 1 && this.loop) {
        next = this.start();
      }
    }

    return next;
  }

  at(): number {
    return this.index;
  }

  end(): boolean {
    return this.index >= this.coordinates.length;
  }

  protected isLoop(): boolean {
    let isLoop = false;
    const round = (numbers: Array<number>): Array<number> => numbers.map((n: number) => _round(n, 6));

    const first = _first(this.coordinates);
    const last = _last(this.coordinates);

    if (first && last) {
      isLoop = _isEqual(round(first), round(last));
    }

    return isLoop;
  }
}
