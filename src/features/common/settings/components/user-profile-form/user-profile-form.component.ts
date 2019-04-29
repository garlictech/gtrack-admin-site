import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'gtrack-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileFormComponent {}
