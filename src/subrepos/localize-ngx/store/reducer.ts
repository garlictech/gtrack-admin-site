import { ActionReducer } from '@ngrx/store';
import { MessageActionTypes, AllActions } from './actions';
import { ILocalizationState } from './state';

const initialState: ILocalizationState = {
  actualLanguage: 'en_US',
  descriptionLanguageList: []
};

const reducer: ActionReducer<ILocalizationState> = (state = initialState, action: AllActions): ILocalizationState => {
  switch (action.type) {
    case MessageActionTypes.LANGUAGE_CHANGED:
      return {
        ...state,
        actualLanguage: action.language
      };

    case MessageActionTypes.DESCRIPTION_LANGUAGE_LIST_CHANGED:
      return {
        ...state,
        descriptionLanguageList: action.languages
      };

    default:
      return state;
  }
};

export { reducer as Reducer };
