import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gtrack-user-profile-form',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileFormComponent {}
