import { EntityState } from '@ngrx/entity';

export interface SvgContentEntityState extends EntityState<SvgContent> {}

export interface SvgContent {
  id: string;
  content: string;
}
export interface State {
  icons: SvgContentEntityState;
  markers: SvgContentEntityState;
}

export const featureName = 'features.common.marker-icons';
