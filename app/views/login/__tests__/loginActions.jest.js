import { configureReduxStore } from 'utils/test/testSetup';
import { any, propEq } from 'ramda';
import { login } from '../login.action';
import * as loginServices from '../login.service';
import {
  LOGIN_REQUESTED,
  LOGIN_RESPONDED,
  UPDATE_SESSION,
  USER_INFO_REQUESTED,
  USER_INFO_RESPONDED,
  UPDATE_ACTIVE_PROFILE,
  USER_LOGGED_IN,
  LOGIN_ERROR,
} from '../login.constants';

jest.mock('../login.service', () => ({
  authenticateUser: jest.fn(),
  getUserInfo: jest.fn(),
}));

describe('Login Actions', () => {
  let store;
  beforeEach(() => {
    store = configureReduxStore({
      login: {},
    });
  });
  test('should authenticate user with valid login', async () => {
    const username = 'abc';
    const password = 'xyx';
    loginServices.authenticateUser.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {
          access_token: 'abc',
          token_type: 'bearer',
          refresh_token: 'xyz',
          expires_in: 86399,
          scope: 'login',
          entity_country: 'US',
          entity_type: 'externaluser',
          entity_id: 17,
          entity_name: 'John Doe',
          temp_password_flag: false,
        },
      }),
    );
    loginServices.getUserInfo.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { vendors: [{}], terms_and_conditions: { accepted: true } },
      }),
    );
    expect.assertions(1);
    try {
      await store.dispatch(login(username, password, {}));
    } catch (e) {
    } finally {
      expect(store.getActions()).toEqual([
        { type: LOGIN_REQUESTED, username },
        { type: LOGIN_RESPONDED },
        {
          type: UPDATE_SESSION,
          email: username,
          session: {
            tokens: {
              access: {
                type: 'bearer',
                value: 'abc',
                expiresIn: 86399,
                timestamp: 1487076708000,
                expirationTimestamp: 1487163107000,
              },
              refresh: {
                type: 'bearer',
                value: 'xyz',
              },
            },
            user: {
              id: 17,
              name: 'John Doe',
              country: 'US',
              type: 'externaluser',
              isTempPass: false,
            },
          },
        },
        { type: USER_INFO_REQUESTED, showSelectionDialog: true },
        {
          type: USER_INFO_RESPONDED,
          loggedIn: false,
          profileInfo: { vendors: [{}], terms_and_conditions: { accepted: true } },
        },
        { type: UPDATE_ACTIVE_PROFILE, vendor: {} },
        { type: USER_LOGGED_IN },
      ]);
    }
  });
  test('on login, it should show the change password screen if password was temporary', async () => {
    const username = 'abc';
    const password = 'xyx';
    loginServices.authenticateUser.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {
          access_token: 'abc',
          token_type: 'bearer',
          refresh_token: 'xyz',
          expires_in: 86399,
          scope: 'login',
          entity_country: 'US',
          entity_type: 'externaluser',
          entity_id: 17,
          entity_name: 'John Doe',
          temp_password_flag: true,
        },
      }),
    );
    loginServices.getUserInfo.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { vendors: [{}], terms_and_conditions: { accepted: true } },
      }),
    );
    const navigator = {
      showModal: jest.fn(),
    };
    expect.assertions(1);
    try {
      await store.dispatch(login(username, password, navigator));
    } catch (e) {
    } finally {
      expect(navigator.showModal.mock.calls[0][0].screen).toEqual(
        'CopartTransporter.ChangePassword',
      );
    }
  });
  test('on login, should show the vendor select screen if more than one vendor is present', async () => {
    const username = 'abc';
    const password = 'xyx';
    loginServices.authenticateUser.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {
          access_token: 'abc',
          token_type: 'bearer',
          refresh_token: 'xyz',
          expires_in: 86399,
          scope: 'login',
          entity_country: 'US',
          entity_type: 'externaluser',
          entity_id: 17,
          entity_name: 'John Doe',
          temp_password_flag: false,
        },
      }),
    );
    loginServices.getUserInfo.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { vendors: [{}, {}], terms_and_conditions: { accepted: true } },
      }),
    );
    const navigator = {
      showModal: jest.fn(),
    };
    navigator.showModal.mockImplementation(({ passProps }) => {
      passProps.resolve();
    });
    expect.assertions(1);
    try {
      await store.dispatch(login(username, password, navigator));
    } catch (e) {
    } finally {
      expect(navigator.showModal.mock.calls[0][0].screen).toEqual(
        'CopartTransporter.Settings.ProfileSelection',
      );
    }
  });
  test('on login, should show the terms and conditions if they have not been selected', async () => {
    const username = 'abc';
    const password = 'xyx';
    loginServices.authenticateUser.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {
          access_token: 'abc',
          token_type: 'bearer',
          refresh_token: 'xyz',
          expires_in: 86399,
          scope: 'login',
          entity_country: 'US',
          entity_type: 'externaluser',
          entity_id: 17,
          entity_name: 'John Doe',
          temp_password_flag: false,
        },
      }),
    );
    loginServices.getUserInfo.mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: { vendors: [{}], terms_and_conditions: { accepted: false } },
      }),
    );
    const navigator = {
      showModal: jest.fn(),
    };
    navigator.showModal.mockImplementation(({ passProps }) => {
      passProps.resolve();
    });
    expect.assertions(1);
    try {
      await store.dispatch(login(username, password, navigator));
    } catch (e) {
    } finally {
      expect(navigator.showModal.mock.calls[0][0].screen).toEqual(
        'CopartTransporter.TermsAndConditions',
      );
    }
  });
  describe('should not log the user in if', () => {
    test('service returns error', async () => {
      const username = 'abc';
      const password = 'xyx';
      const error = {
        status: 400,
        error: {
          email: ['email not found'],
        },
      };
      loginServices.authenticateUser.mockImplementation(() => Promise.reject(error));
      expect.assertions(1);
      try {
        await store.dispatch(login(username, password, {}));
      } catch (e) {
      } finally {
        const result = any(propEq('type', LOGIN_ERROR))(store.getActions());
        expect(result).toBe(true);
      }
    });
    test('password is temporary', async () => {
      const username = 'abc';
      const password = 'xyx';
      loginServices.authenticateUser.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: 'abc',
            token_type: 'bearer',
            refresh_token: 'xyz',
            expires_in: 86399,
            scope: 'login',
            entity_country: 'US',
            entity_type: 'externaluser',
            entity_id: 17,
            entity_name: 'John Doe',
            temp_password_flag: true,
          },
        }),
      );
      const navigator = {
        showModal: jest.fn(),
      };
      expect.assertions(1);
      try {
        await store.dispatch(login(username, password, {}));
      } catch (e) {
      } finally {
        const result = any(propEq('type', LOGIN_ERROR))(store.getActions());
        expect(result).toBe(true);
      }
    });
    test('user rejects terms and conditions', async () => {
      const username = 'abc';
      const password = 'xyx';
      loginServices.authenticateUser.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: 'abc',
            token_type: 'bearer',
            refresh_token: 'xyz',
            expires_in: 86399,
            scope: 'login',
            entity_country: 'US',
            entity_type: 'externaluser',
            entity_id: 17,
            entity_name: 'John Doe',
            temp_password_flag: false,
          },
        }),
      );
      loginServices.getUserInfo.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: { vendors: [{}], terms_and_conditions: { accepted: false } },
        }),
      );
      const navigator = {
        showModal: jest.fn(),
      };
      navigator.showModal.mockImplementation(({ passProps }) => {
        passProps.reject();
      });
      expect.assertions(1);
      try {
        await store.dispatch(login(username, password, {}));
      } catch (e) {
      } finally {
        const result = any(propEq('type', LOGIN_ERROR))(store.getActions());
        expect(result).toBe(true);
      }
    });
    test('user rejects choosing a vendor', async () => {
      const username = 'abc';
      const password = 'xyx';
      loginServices.authenticateUser.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: {
            access_token: 'abc',
            token_type: 'bearer',
            refresh_token: 'xyz',
            expires_in: 86399,
            scope: 'login',
            entity_country: 'US',
            entity_type: 'externaluser',
            entity_id: 17,
            entity_name: 'John Doe',
            temp_password_flag: false,
          },
        }),
      );
      loginServices.getUserInfo.mockImplementation(() =>
        Promise.resolve({
          status: 200,
          data: { vendors: [{}, {}], terms_and_conditions: { accepted: true } },
        }),
      );
      const navigator = {
        showModal: jest.fn(),
      };
      navigator.showModal.mockImplementation(({ passProps }) => {
        passProps.reject();
      });
      expect.assertions(1);
      try {
        await store.dispatch(login(username, password, {}));
      } catch (e) {
      } finally {
        const result = any(propEq('type', LOGIN_ERROR))(store.getActions());
        expect(result).toBe(true);
      }
    });
  });
});
