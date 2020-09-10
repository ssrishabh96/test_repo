import { buildSession, checkIfSingleVendorPresent } from '../helpers/loginHelpers';

describe('Login Helper', () => {
  test('buildSession should prepare to session object from response', () => {
    const response = {
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
      },
    };
    const session = buildSession(response.data);
    expect(session).toEqual({
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
      },
    });
  });
  describe('Profile selection for logged in user', () => {
    test('Select if only one vendor present in profile', () => {
      const response = {
        vendors: [
          {
            vendor_id: 42481,
            vendor_name: 'Very Good Towing',
            insurance_expiration_date: null,
            role: 2,
            personnel_id: 23416,
            groups: [
              {
                dispatch_group_id: 3015,
                dispatch_group_name: 'DEFAULT',
              },
            ],
          },
        ],
      };
      const result = checkIfSingleVendorPresent(response);
      expect(result).toEqual({
        result: true,
        vendor: {
          vendor_id: 42481,
          vendor_name: 'Very Good Towing',
          insurance_expiration_date: null,
          role: 2,
          personnel_id: 23416,
          groups: [
            {
              dispatch_group_id: 3015,
              dispatch_group_name: 'DEFAULT',
            },
          ],
        },
      });
    });
    test('multiple vendors present in profile', () => {
      const response = {
        vendors: [
          {
            vendor_id: 42481,
            vendor_name: 'Very Good Towing',
            insurance_expiration_date: null,
            role: 2,
            personnel_id: 23416,
            groups: [
              {
                dispatch_group_id: 3015,
                dispatch_group_name: 'DEFAULT',
              },
            ],
          },
          {
            vendor_id: 42482,
            vendor_name: 'Another Good Towing',
            insurance_expiration_date: null,
            role: 2,
            personnel_id: 23416,
            groups: [
              {
                dispatch_group_id: 3016,
                dispatch_group_name: 'DEFAULT',
              },
            ],
          },
        ],
      };
      const result = checkIfSingleVendorPresent(response);
      expect(result).toEqual({
        result: false,
        vendor: null,
      });
    });
  });
});
