import { Subject } from 'rxjs/Subject';

export class DestroyableComponent {
  protected _destroy$ = new Subject<boolean>();

  protected _destroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}
