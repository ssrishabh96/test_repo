import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';

import SettingsItem from './components/settingsItem';
import getSettingsData from './settingsData';
import { resetToolTips } from './settings.action';
import { getVersionNumber, getBuildNumber } from 'views/settings/settings.redux';

type Props = {
  resetToolTips: () => any,
  languageName: string,
};
class Settings extends Component<Props> {
  getField = (key) => {
    switch (key) {
      case 'language':
        return this.props.languageName;
      case 'profile':
        return this.props.activeProfile;
      case 'version':
        return this.props.version;
      default:
        return null;
    }
  };
  handlePress = (onPressType, key, pressParams) => {
    if (onPressType === 'modal') this.props.navigator.showModal(pressParams);
    else if (onPressType === 'push') this.props.navigator.push(pressParams);
    else {
      switch (key) {
        case 'ToolTip':
          this.props.resetToolTips();
          break;
        default:
          () => null;
          break;
      }
    }
  };
  render() {
    const settingRowData = getSettingsData();
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: 'white',
          backgroundColor: '#efefef',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <SectionList
          sections={settingRowData.links}
          renderItem={({ item }) => (
            <SettingsItem
              item={item}
              onPress={() => this.handlePress(item.onPressType, item.key, item.pressParams)}
              value={this.getField(item.key)}
              keyExtractor={item.key}
            />
          )}
          renderSectionFooter={separator}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  version: getVersionNumber(state),
  buildNumber: getBuildNumber(state),
  languageName: state.settings.languageName,
  activeProfile: pathOr('', [
    'login',
    'user',
    'profiles',
    'activeProfile',
    'vendor',
    'vendor_name',
  ])(state),
});
const mapDispatchToProps = {
  resetToolTips,
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const separator = () => <View style={{ backgroundColor: '#efefef', height: 30 }} />;
