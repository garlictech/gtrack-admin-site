import { Field, IField } from './field';

export interface IHtmlField extends IField<string> {
  content: string;
}

export class HtmlField extends Field<string> {
  controlType = 'html';
  content: string;

  constructor(options: IHtmlField) {
    super(options);

    this.content = options.content;
    this.disableLabel = true;
  }
}
