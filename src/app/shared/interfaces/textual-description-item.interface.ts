import { ITextualDescription } from 'subrepos/provider-client';

export interface TextualDescriptionItem extends ITextualDescription {
  id: string;
  title: string;
  summary?: string;
  fullDescription?: string;
}
