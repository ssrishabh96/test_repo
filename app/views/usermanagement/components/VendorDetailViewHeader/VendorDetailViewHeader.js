// @flow

import React from 'react';
import { View, Text } from 'react-native';

// import { RowView, InfoText } from 'styles';

const VendorDetailViewHeader = ({ contactName }: { contactName: string }) => (
  <View style={{ padding: 10 }}>
    <View>
      <Text style={{ alignContent: 'center', fontSize: 20, color: 'black' }}>{contactName}</Text>
      <Text style={{ marginTop: 5, color: 'black' }}>Default Copart Group</Text>
    </View>
    {/* <View style={{ padding: 10, alignItems: 'center' }}>
      <InfoText
        style={{
          fontSize: 16,
          color: 'black',
          textDecorationLine: 'underline',
        }}
      >
        Tow Provider / Dispatch Group
      </InfoText>
      </View> */}
  </View>
);

export default VendorDetailViewHeader;
