import { SwitchField, SwitchFieldOptions } from '@bit/garlictech.angular-features.common.forms';

export const options: SwitchFieldOptions = {
  required: true,
  submitOnChange: true
};

export const commonSettingsForm = {
  messageSound: new SwitchField(options)
};
