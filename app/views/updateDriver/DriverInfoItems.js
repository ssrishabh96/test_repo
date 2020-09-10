import React from 'react';
import { View } from 'react-native';
import renderIf from 'render-if';
import moment from 'moment';

import InfoItem from 'views/driverprofile/components/DriverInfoItem/DriverInfoItem';

type Props = {
  groupName: string,
  user: Object,
};
export default ({ type, groupName, user }: Props) => {
  const dispatchable = user.dispatchableFlag;
  const pCardStatus = user.pcardFlg && user.pcardFlg === 'Y';
  return (
    <View>
      <InfoItem
        label="Group"
        value={groupName || 'N/A'}
      />
      <InfoItem
        label="Email"
        value={user.email}
      />
      <InfoItem
        label="Dispatchable"
        value={dispatchable ? 'Yes' : 'No'}
      />
      <InfoItem
        label="Pcard"
        value={pCardStatus ? 'Yes' : 'No'}
      />
      <InfoItem
        label="Start Date"
        value={new moment(user.startDate).format('YYYY-MM-DD') || 'N/A'}
      />
    </View>
  );
};
