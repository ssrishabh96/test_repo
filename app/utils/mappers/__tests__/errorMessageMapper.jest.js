/* eslint-disable max-len */

import { buildErrorMessage } from '../errorMessageMapper';

describe('Error Message Parse', () => {
  describe('pickup form errors', () => {
    test('should parse submit pickup form api response errors', () => {
      const e = [
        {
          acknowledgements: [
            'did not pass mandatory fields: ["driver_name", "owner_name", "date_picked_up", "notes"]',
          ],
        },
      ];
      const coId = 'Transporter-Mobile-uuid-123';

      const errorResponse = {
        data: {
          errors: e,
          corelation_id: coId,
        },
      };

      const parsedErrorMessage = buildErrorMessage(errorResponse.data);

      const notificationMessage =
        'acknowledgements: did not pass mandatory fields: ["driver_name", "owner_name", "date_picked_up", "notes"]\nError-Id: Transporter-Mobile-uuid-123';
      expect(parsedErrorMessage).toEqual(notificationMessage);
    });
    test('should empty response error for unknown error', () => {
      const parsedErrorMessage = buildErrorMessage({});
      const emptyNotificationMessage = '';
      expect(parsedErrorMessage).toEqual(emptyNotificationMessage);
    });
  });
});
