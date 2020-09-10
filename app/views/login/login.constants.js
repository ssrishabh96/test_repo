export const session = {
  tokens: {
    access: {
      type: null,
      value: null,
      expiresIn: null,
    },
    refresh: {
      type: null,
      value: null,
    },
  },
  user: {
    id: null,
  },
};

export const initialState = {
  loggedIn: false,
  isLoading: false,
  error: null,
  termsAndConditions: {
    isSubmitting: false,
    accepted: true,
  },
  form: {
    username: '',
  },
  user: {
    name: '',
    profiles: {
      profileInfo: {},
      activeProfile: {
        vendor: { vendor_id: null, vendor_name: '', personnel_data: { role_id: 3 } },
      },
      showSelectionDialog: false,
      isLoading: false,
    },
  },
  session,
  email: null,
};
export const LOGIN_REQUESTED = 'LOGIN_REQUESTED';
export const LOGIN_RESPONDED = 'LOGIN_RESPONDED';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const LOGOUT = 'LOGOUT';

export const UPDATE_SESSION = 'UPDATE_SESSION';

export const USER_INFO_REQUESTED = 'USER_INFO_REQUESTED';
export const USER_INFO_RESPONDED = 'USER_INFO_RESPONDED';
export const UPDATE_ACTIVE_PROFILE = 'UPDATE_ACTIVE_PROFILE';

export const FORGOTPASSWORD_REQUESTED = 'FORGOTPASSWORD_REQUESTED';
export const CHANGEPASSWORD_REQUESTED = 'CHANGEPASSWORD_REQUESTED';

export const ACCEPT_TERMS_REQUESTED = 'ACCEPT_TERMS_REQUESTED';
export const ACCEPT_TERMS_RESPONDED = 'ACCEPT_TERMS_RESPONDED';
