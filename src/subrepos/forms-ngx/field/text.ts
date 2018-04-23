import { Field, IField } from './field';

export interface ITextField extends IField<string> {
  textKey: string;
}

export class TextField extends Field<string> {
  controlType = 'text';
  textKey: string;

  constructor(options: ITextField) {
    super(options);

    this.textKey = options.textKey;
    this.disableLabel = true;
  }
}
