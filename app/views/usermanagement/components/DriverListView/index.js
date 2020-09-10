import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SwipeListView } from 'react-native-swipe-list-view';

import DriverRow from '../DriverRow';

import { Container, LoadingIndicator, defaultNavStyles } from 'styles';
import colors from 'styles/colors';

/**
 * DriverListView is responsible to render the view
 * for the drivers list in UserManagement view.
 * @param {array} data
 * @param {boolean} isLoading
 * @param {function} onItemPress
 */
export default class DriverListView extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, // eslint-disable-line
    isLoading: PropTypes.bool.isRequired,
    onItemPress: PropTypes.func.isRequired,
    onEditDriverProfile: PropTypes.func.isRequired,
    navigator: PropTypes.any, // eslint-disable-line
  };

  static navigatorStyles = defaultNavStyles;

  onRowDidOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      this.closeRow(rowMap, rowKey);
    }, 250);
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  addNewDriver = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.DriverForm',
      passProps: {
        action: 'create',
      },
    });
  };

  /**
   * @param {object} item represents the object for rows under each section
   * @param {function} onItemPress onPress handler for each row
   * @returns {React.Component} Returns a React Component for each row under a section
   */
  renderItem = ({ item }) => (<DriverRow
    driver={item}
    onPressItem={this.props.onItemPress}
  />);

  render() {
    const { isLoading, data, onEditDriverProfile } = this.props;
    const renderIfIsLoading = renderIf(isLoading);
    const renderIfNotIsLoading = renderIf(!isLoading);
    return (
      <Container>
        {renderIfIsLoading(<LoadingIndicator size="large" />)}
        {renderIfNotIsLoading(
          <SwipeListView
            useFlatList
            data={data}
            keyExtractor={item => item.vendorPersonnelId}
            onRowDidOpen={this.onRowDidOpen}
            disableRightSwipe
            rightOpenValue={-75}
            renderItem={this.renderItem}
            renderHiddenItem={rowData => (
              <View
                style={{
                  alignItems: 'flex-end',
                  backgroundColor: '#DDD',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.LIGHT_GREEN,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 75,
                  }}
                  onPress={() => onEditDriverProfile(rowData.item)}
                >
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          />,
        )}
        <ActionButton
          onPress={() => this.addNewDriver()}
          style={{ padding: 5, opacity: 0.9 }}
          buttonColor={colors.GRAY_DARK_1}
          icon={<Icon
            size={35}
            name={'add'}
            color={'#fff'}
          />}
        />
      </Container>
    );
  }
}
