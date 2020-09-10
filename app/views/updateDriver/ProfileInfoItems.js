import React from 'react';
import { View } from 'react-native';
import renderIf from 'render-if';
import InfoItem from 'views/driverprofile/components/DriverInfoItem/DriverInfoItem';
import { RowView, InfoText } from 'styles';

type Props = {
  groupName: string | 'N/A',
  user: {
    phoneNum?: string,
  },
};
export default ({ user, groupName }: Props) => {
  const dispatchable = user.dispatchableFlag;
  const pCardStatus = user.pcardFlg && user.pcardFlg === 'Y';

  return (
    <View>
      <InfoItem
        label="GroupName"
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
        value={user.startDate || '09/11/2009'}
      />
    </View>
  );
};
