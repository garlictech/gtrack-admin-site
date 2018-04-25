import { Action, ActionReducer, Store } from '@ngrx/store';
import { MessageActionTypes, AllActions } from './actions';
import { ILocalizationState } from './state';

const initialState: ILocalizationState = {
  actualLanguage: 'en_US'
};

const reducer: ActionReducer<ILocalizationState> = (state = initialState, action: AllActions): ILocalizationState => {
  switch (action.type) {
    case MessageActionTypes.LANGUAGE_CHANGED:
      return { actualLanguage: action.language };

    default:
      return state;
  }
};

export { reducer as Reducer };
