import {
  SIGNUP_ACTION_INIT,
  SIGNUP_ACTION_SUCCESS,
  SIGNUP_ACTION_FAILURE,
  CLEAR_SIGNUP_MESSAGES,
} from './signup.constants';

export type Props = {
  clearMessages: () => void,
  submitSignUpForm?: ?any,
  err: { message: string } | string,
  isRegistered: ?boolean,
  navigator: any,
};

export type State = void;

export type ReducerStateType = {
  +isLoading: ?boolean,
  +err: ?{ message: string } | ?string,
  +message: ?string,
  +isRegistered: ?boolean,
};

export type SignUpInitType = {
  type: SIGNUP_ACTION_INIT,
};

export type SignUpSuccessType = {
  type: SIGNUP_ACTION_SUCCESS,
  message: string,
};

export type SignUpFailureType = {
  type: SIGNUP_ACTION_FAILURE,
  err: { message: string } | string,
};

export type ClearSignupMessagesType = {
  type: CLEAR_SIGNUP_MESSAGES,
};

export type ActionType =
  | SignUpInitType
  | SignUpSuccessType
  | SignUpFailureType
  | ClearSignupMessagesType;

// Redux Thunk Annotations
export type GetState = () => any;
export type PromiseAction = Promise<ActionType>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (
  action: ActionType | PromiseAction | ThunkAction | Array<ActionType> | Array<any>
) => any;

export type FormValuesType = {
  firstName?: ?string,
  lastName?: ?string,
  emailId?: ?string,
  userTypeCode?: ?string,
  password?: ?string,
  confirmPassword?: ?string,
};
