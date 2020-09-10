import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';

import { driverSelector } from '../../drivercontainer/drivercontainer.redux';
import { groupsSelector } from '../../groupscontainer/groupscontainer.redux';

import DriverListView from '../DriverListView';
import GroupsListView from '../GroupsListView';
import TabBarHeader from '../TabBarHeader';

import styles from './styles';

class UserManagementTabBarContainer extends Component {
  static propTypes = {
    groupIsLoading: PropTypes.bool.isRequired,
    driverIsLoading: PropTypes.bool.isRequired,
    onDriverItemPress: PropTypes.func.isRequired,
    onGroupItemPress: PropTypes.func.isRequired,
    onTabIndexChanged: PropTypes.func.isRequired,
    driversList: PropTypes.array.isRequired, // eslint-disable-line
    groupData: PropTypes.array.isRequired, // eslint-disable-line
    props: PropTypes.any, // eslint-disable-line
    navProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    groupIsLoading: false,
    driverIsLoading: false,
    driversList: [],
    groupData: [],
    navProps: {
      index: 0,
      routes: [{ key: 'groups', title: 'Groups' }, { key: 'drivers', title: 'Drivers' }],
    },
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'groups':
        return (
          <GroupsListView
            data={this.props.groupData}
            isLoading={this.props.groupIsLoading}
            onItemPress={this.props.onGroupItemPress}
          />
        );
      case 'drivers':
        return (
          <DriverListView
            data={this.props.driverData}
            isLoading={this.props.driverIsLoading}
            onItemPress={this.props.onDriverItemPress}
            onEditDriverProfile={this.props.onEditDriverProfile}
            navigator={this.props.navigator}
          />
        );
      default:
        return null;
    }
  };

  renderPager = (props: any) => (<TabViewPagerPan
    swipeEnabled={false}
    {...props}
  />);

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabViewAnimated
          style={[styles.container]}
          navigationState={this.props.navProps}
          renderScene={this.renderScene}
          renderPager={this.renderPager}
          renderHeader={props => (
            <TabBarHeader
              tabBarHeaderProps={props}
              groupCount={this.props.groupData.length}
              driverCount={this.props.driverData.length}
            />
          )}
          onIndexChange={this.props.onTabIndexChanged}
          useNativeDriver
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...groupsSelector(state),
  ...driverSelector(state),
});

export default connect(mapStateToProps)(UserManagementTabBarContainer);
