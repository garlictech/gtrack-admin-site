import { SwitchField, ISwitchField } from 'subrepos/forms-ngx';

export const options: ISwitchField = {
  required: true,
  submitOnChange: true
};

export const commonSettingsForm = {
  messageSound: new SwitchField(options)
};
