export enum ETitleType {
  main = 'mainTitle',
  section = 'sectionTitle'
}

export interface ITitle {
  translatableLabel: string;
  controlType: ETitleType;
}

export class Title implements ITitle {
  translatableLabel: string;
  controlType: ETitleType;

  constructor(options: ITitle) {
    this.translatableLabel = options.translatableLabel;
    this.controlType = options.controlType;
  }
}
