import { TextualDescription } from '@bit/garlictech.angular-features.common.gtrack-interfaces';

export interface TextualDescriptionItem extends TextualDescription {
  id: string;
  title: string;
  summary?: string;
  fullDescription?: string;
}
