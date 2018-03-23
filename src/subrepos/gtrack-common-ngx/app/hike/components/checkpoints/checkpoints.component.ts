import { Component, Input } from '@angular/core';
import { Checkpoint } from '../../services/checkpoint';

@Component({
  selector: 'gtcn-checkpoints',
  templateUrl: './checkpoints.component.html',
  styleUrls: ['./checkpoints.component.scss']
})
export class CheckpointsComponent {
  @Input()
  public set checkpoints(checkpoints: Checkpoint[]) {
    if (checkpoints instanceof Array) {
      this._checkpoints = checkpoints;
    }
  }

  public get checkpoints(): Checkpoint[] {
    return this._checkpoints;
  }

  private _checkpoints: Checkpoint[] = [];
}
