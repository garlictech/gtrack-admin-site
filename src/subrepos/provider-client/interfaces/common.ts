export enum ETextualDescriptionType {
  markdown = 'markdown',
  html = 'html'
}

export interface ITextualDescription {
  title: string;
  summary?: string;
  fullDescription?: string;
  type?: ETextualDescriptionType;
}

export interface ILocalizedItem<T> {
  [s: string]: T;
}
