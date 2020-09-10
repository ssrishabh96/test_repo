import React, { Component } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

import {
  getInitialField,
  getInitialValues,
  prepareFinalSelected,
  prepareInitialSelected,
  prepareData,
  getAvailableFilters,
  getSelectedCount,
} from './filter.helpers';

import FullScreenLoader from 'components/custom/FullScreenLoader';
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import ValuesList from './components/ValuesList';

type Props = {
  +navigator: Object,
  +applyFilter: (selectedFilters: Object, totalCount: number) => any,
  +selectedFilters: {
    [string]: string[],
  },
  +totalCount: number,
  +bucket: string,
  +isVisible: boolean,
  +closeFilters: () => null,
};

export default class Filter extends Component<Props> {
  state = {
    loading: true,
    selectedFilters: {},
    totalCount: 0,
    field: '',
    values: [],
    availableFilters: [],
  };
  componentWillMount() {
    if (this.props.isVisible) this.onLaunch(); // ? ??
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) this.onLaunch();
  }
  onLaunch = () => {
    this.setState({
      loading: true,
      selectedFilters: {},
      totalCount: 0,
      field: '',
      values: [],
      availableFilters: [],
    });
    getAvailableFilters(this.props.bucket)
      .then((data) => {
        const filters = prepareData(data);
        const selected = prepareInitialSelected(this.props.selectedFilters, data);
        this.setState({
          selectedFilters: selected,
          totalCount: getSelectedCount(selected),
          loading: false,
          field: getInitialField(filters),
          values: getInitialValues(filters),
          availableFilters: filters,
        });
      })
      .catch((error) => {
        // console.log error
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'warning',
            content: 'Unable to retrieve filters',
          },
        });
        this.props.closeFilters();
      });
  };
  onItemSelected = (field: string, label: string, values: Array) => {
    this.setState({
      field,
      values,
    });
  };
  onCheckboxSelected = (field: string, code: string) => {
    this.setState({
      selectedFilters: {
        ...this.state.selectedFilters,
        [field]: this.state.selectedFilters[field]
          ? {
            ...this.state.selectedFilters[field],
            [code]: !this.state.selectedFilters[field][code],
            count: this.state.selectedFilters[field][code]
              ? this.state.selectedFilters[field].count - 1
              : this.state.selectedFilters[field].count + 1,
          }
          : { [code]: true, count: 1 },
      },
      totalCount:
        this.state.selectedFilters[field] && this.state.selectedFilters[field][code]
          ? this.state.totalCount - 1
          : this.state.totalCount + 1,
    });
  };
  getSelectedFilterCount = field =>
    this.state.selectedFilters[field] ? this.state.selectedFilters[field].count : 0;
  resetFilter = () => {
    this.setState({
      selectedFilters: {},
      totalCount: 0,
    });
  };
  handleOnApply = () => {
    const selected = prepareFinalSelected(this.state.selectedFilters);
    this.props.applyFilter(selected, this.state.totalCount);
    this.props.closeFilters();
  };
  render() {
    const { field, values, selectedFilters, totalCount, loading, availableFilters } = this.state;
    return (
      <Modal
        transparent
        visible={this.props.isVisible}
        animationType="slide"
      >
        <View style={styles.container}>
          <Header
            bucket={this.props.bucket}
            totalCount={totalCount}
            resetFilter={this.resetFilter}
            handleOnApply={this.handleOnApply}
            closeFilters={this.props.closeFilters}
          />
          {loading ? (
            <View style={styles.innerContainer}>
              <FullScreenLoader />
            </View>
          ) : (
            <View style={styles.innerContainer}>
              <CategoryList
                data={availableFilters}
                field={field}
                onPress={this.onItemSelected}
                selectedFilters={selectedFilters}
              />
              <ValuesList
                data={values}
                field={field}
                onPress={this.onCheckboxSelected}
                selectedFilters={selectedFilters}
              />
            </View>
          )}
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 10, 0.78)',
    // marginTop: 64,
  },
  innerContainer: { flex: 1, flexDirection: 'row', backgroundColor: 'white' },
});
