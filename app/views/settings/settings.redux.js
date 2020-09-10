import { pathOr, pick, map, compose, omit } from 'ramda';
import {
  initialState,
  SETTINGS_LANG_CHANGE,
  CHANGE_CURRENT_VEHICLE,
  RESET_TOOLTIPS_VIEWED,
  DISMISS_TOOLTIP_PAGE,
  SET_ONBOARDING_COMPLETE,
  UPDATE_LOCATION,
  ACCEPT_TERMS,
  SET_CONNECTIVITY,
} from './settings.constants';

const pickSettingsProps = pick([
  'countryCode',
  'countryName',
  'languageCode',
  'languageName',
  'location',
  'currentVehicle',
  'tooltip',
  'onboardingCompleted',
  'termsAndConditions',
]);

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTINGS_LANG_CHANGE:
      return {
        ...state,
        languageCode: action.languageCode,
        languageName: action.languageName,
      };
    case CHANGE_CURRENT_VEHICLE:
      return {
        ...state,
        currentVehicle: action.currentVehicle,
      };
    case RESET_TOOLTIPS_VIEWED:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          hasViewedPages: map(() => false, state.tooltip.hasViewedPages),
        },
      };
    case DISMISS_TOOLTIP_PAGE:
      return {
        ...state,
        tooltip: {
          ...state.tooltip,
          hasViewedPages: {
            ...state.tooltip.watchedPages,
            [action.page]: true,
          },
        },
      };
    case SET_ONBOARDING_COMPLETE:
      return {
        ...state,
        onboardingCompleted: true,
      };
    case ACCEPT_TERMS:
      return {
        ...state,
        termsAndConditions: {
          accepted: true,
          timestamp: action.timestamp,
        },
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        location: action.position,
      };
    case SET_CONNECTIVITY:
      return {
        ...state,
        connectionStatus: {
          active: action.connectionStatus,
          timestamp: action.timestamp,
        },
      };
    case 'persist/REHYDRATE': {
      return {
        ...initialState,
        ...compose(pickSettingsProps, pathOr({}, ['payload', 'settings']))(action),
      };
    }
    default:
      return state;
  }
};
export default settingsReducer;

export const getVersionNumber = pathOr('', ['settings', 'version']);
export const getBuildNumber = pathOr('', ['settings', 'buildNumber']);
export const getUserLocation = pathOr({ latitude: '', longitude: '' }, [
  'settings',
  'location',
  'coords',
]);
export const getConnectionStatus = pathOr(true, ['settings', 'connectionStatus', 'active']);
