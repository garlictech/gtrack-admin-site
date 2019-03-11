import { Subject } from 'rxjs';

export class DestroyableComponent {
  protected _destroy$;

  constructor() {
    this._destroy$ = new Subject<boolean>();
  }

  protected _destroy(): void {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
