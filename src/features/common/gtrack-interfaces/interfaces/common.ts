export enum ETextualDescriptionType {
  markdown = 'markdown',
  html = 'html'
}

export interface TextualDescription {
  title: string;
  summary?: string;
  fullDescription?: string;
  type?: ETextualDescriptionType;
}

export interface LocalizedItem<T> {
  [s: string]: T;
}
