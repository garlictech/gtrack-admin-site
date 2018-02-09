import { ILocalizedItem, ITextualDescription } from 'subrepos/provider-client';

export interface IMockHikeElement {
  id?: string;
  description?: ILocalizedItem<ITextualDescription>;
}
