export interface PopupData {
  title?: string;
  message?: string;
}

export interface PopupState {
  popup: PopupData;
}

export const initialPopupState = {
  popup: {}
};

export const featureName = 'features.common.popup';
