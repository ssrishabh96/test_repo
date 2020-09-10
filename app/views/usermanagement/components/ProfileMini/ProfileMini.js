// @flow

import type { Props } from './types';

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import renderIf from 'render-if';
import { compose, join, map, prop, __ } from 'ramda';

import StatusAndDispatchableFlagRow from '../StatusAndDispatchableFlagRow';
import ProfileMiniInfoItem from './ProfileMiniInfoItem';

import icons from 'constants/icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from 'styles/colors';
import { formatPhoneNumber } from 'utils';
import Locale from 'utils/locale';

const locationToArray = (loc: Object) =>
  map(prop(__, loc))(['line1', 'line2', 'city', 'state', 'zip']);
const encodeLocation = compose(
  encodeURIComponent,
  join(' '),
  locationToArray,
);

const openMap = (location: Object) => {
  const address = encodeLocation(location);
  const link = Platform.select({
    ios: `http://maps.apple.com/?q=${address}&z=15`,
    android: `http://maps.google.com/maps?daddr=${address}&z=15`,
  });
  Linking.openURL(link).catch(err => console.error('An error occured', '??', err));
};

const ProfileMini = ({ vendor, user, ...props }: Props) => {
  const renderIfIsLoading = renderIf(
    props.isLoading || !vendor || (vendor && Object.keys(vendor).length <= 0),
  );
  const renderIfIsNotLoading = renderIf(
    !props.isLoading && vendor && Object.keys(vendor).length > 0,
  );
  const NA = Locale.translate('N/A');
  return (
    <View style={{ margin: 10, minHeight: 110 }}>
      {renderIfIsLoading(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>,
      )}
      {renderIfIsNotLoading(
        <View>
          <ProfileMiniInfoItem
            label="Name"
            value={`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
          />

          <ProfileMiniInfoItem
            label="Tow Provider"
            value={(vendor && vendor.vendorName) || 'N/A'}
          />

          <StatusAndDispatchableFlagRow
            status={user && user.status}
            dispatchableFlag={user && user.dispatchableFlag}
          />

          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Image
              source={icons.tripsScreen.tripIconLocationPin}
              style={{ marginRight: 5 }}
            />
            <TouchableOpacity onPress={() => openMap(vendor.primaryAddress)}>
              <Text style={{ color: colors.COPART_BLUE, fontWeight: '500', fontSize: 15 }}>
                {(vendor &&
                  vendor.primaryAddress &&
                  `${vendor.primaryAddress.line1 || NA}, ${vendor.primaryAddress.city ||
                    NA}}, ${vendor.primaryAddress.stateCode ||
                    vendor.primaryAddress.state ||
                    NA}} - ${vendor.primaryAddress.postalCode ||
                    vendor.primaryAddress.zip ||
                    NA}}`) || { NA }}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <ProfileMiniInfoItem
              label="Contact"
              value={(user && user.phoneNum && formatPhoneNumber(user.phoneNum)) || 'N/A'}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={props.onEditVendorProfile}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#323742',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                top: -37,
                zIndex: 999,
                opacity: 0.9,
              }}
            >
              <Icon
                size={22}
                name={'pencil'}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>,
      )}
    </View>
  );
};

export default ProfileMini;
