import { ITextualDescription } from 'subrepos/provider-client';

export interface ITextualDescriptionItem extends ITextualDescription {
  id: string;
  title: string;
  summary?: string;
  fullDescription?: string;
}
