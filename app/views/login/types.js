import { LOGIN_REQUESTED, LOGIN_RESPONDED, LOGOUT } from './login.constants';

export type State = {
  loggedIn: boolean,
  isLoading: boolean,
  error: ?string | ?Object,
  termsAndConditions: {
    isSubmitting: boolean,
    accepted: boolean,
  },
  form: {
    username: string,
  },
  user: {
    name: string,
    profiles: {
      profileInfo: Object,
      activeProfile: {
        vendor: {
          vendor_id: number,
          vendor_name: string,
          personnel_data: Object,
        },
      },
      showSelectionDialog: boolean,
      isLoading: boolean,
    },
  },
  session: Object,
  email: string,
};

export type LoginRequestedAction = {
  type: LOGIN_REQUESTED,
};

export type LoginRespondedAction = {
  type: LOGIN_RESPONDED,
};

export type LogoutAction = {
  type: LOGOUT,
};

export type Action = LoginRequestedAction | LoginRespondedAction | LogoutAction;

type PromiseAction = Promise<Action>;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
