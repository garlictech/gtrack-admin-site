import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'gtrack-user-profile-form',
  templateUrl: './ui.pug',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileFormComponent {
  constructor() {
    /* EMPTY */
  }
}
