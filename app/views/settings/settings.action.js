import Locale from 'utils/locale';
import {
  SETTINGS_LANG_CHANGE,
  CHANGE_CURRENT_VEHICLE,
  RESET_TOOLTIPS_VIEWED,
  DISMISS_TOOLTIP_PAGE,
  SET_ONBOARDING_COMPLETE,
  UPDATE_LOCATION,
  SET_CONNECTIVITY,
} from './settings.constants';

export const changeLanguageSettings = (languageCode, languageName) => (dispatch) => {
  Locale.setLanguage(languageCode);
  dispatch({
    type: SETTINGS_LANG_CHANGE,
    languageCode,
    languageName,
  });
};

export const changeCurrentVehicle = currentVehicle => (dispatch) => {
  dispatch({
    type: CHANGE_CURRENT_VEHICLE,
    currentVehicle,
  });
};

export const resetToolTips = () => (dispatch) => {
  dispatch({ type: RESET_TOOLTIPS_VIEWED });
};

export const dismissToolTips = (page: string) => (dispatch) => {
  dispatch({ type: DISMISS_TOOLTIP_PAGE, page });
};

export const setOnboardingComplete = () => (dispatch) => {
  dispatch({ type: SET_ONBOARDING_COMPLETE });
};

export const updateLocation = position => (dispatch) => {
  dispatch({ type: UPDATE_LOCATION, position });
};
