export interface ITextualDescription {
  title: string;
  summary?: string;
  fullDescription?: string;
}

export interface ILocalizedItem<T> {
  [s: string]: T;
}
