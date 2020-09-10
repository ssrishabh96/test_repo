import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/*
  handling platform specific version,
  since we may not have concurrent releases for each version
*/
const CODE_PUSH_VERSION_IOS = 3;
const CODE_PUSH_VERSION_ANDROID = 3;
const getCodePushVersion = () =>
  Platform.select({ ios: CODE_PUSH_VERSION_IOS, android: CODE_PUSH_VERSION_ANDROID });

export const initialState = {
  // version: DeviceInfo.getReadableVersion(),
  version: `${DeviceInfo.getVersion()} - ${getCodePushVersion()}`,
  build: DeviceInfo.getBuildNumber(),
  countryCode: 'US',
  countryName: 'United States',
  languageCode: 'en-us',
  languageName: 'English',
  location: {
    coords: { latitude: '', longitude: '' },
  },
  currentVehicle: '2 Car(1 Flatbed, 1 Tow)',
  tooltip: {
    hasViewedPages: {
      lotview: true, // add all screens with tips here.
    },
  },
  onboardingCompleted: false,
  termsAndConditions: {
    accepted: false,
  },
  connectionStatus: { active: true, timestamp: null },
};

export const SETTINGS_LANG_CHANGE = 'SETTINGS_LANG_CHANGE';
export const CHANGE_CURRENT_VEHICLE = 'CHANGE_CURRENT_VEHICLE';
export const RESET_TOOLTIPS_VIEWED = 'RESET_TOOLTIPS_VIEWED';
export const DISMISS_TOOLTIP_PAGE = 'DISMISS_TOOLTIP_PAGE';
export const SET_ONBOARDING_COMPLETE = 'SET_ONBOARDING_COMPLETE';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
export const ACCEPT_TERMS = 'ACCEPT_TERMS';
export const SET_CONNECTIVITY = 'SET_CONNECTIVITY';
