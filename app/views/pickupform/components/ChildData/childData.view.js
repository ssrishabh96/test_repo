import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import renderIf from 'render-if';
import debounce from 'debounce';
import {
  sortBy,
  prop,
  filter,
  compose,
  contains,
  propOr,
  toLower,
  reduce,
  equals,
  keys,
  pathOr,
  join,
} from 'ramda';

import AtoZlist from './AtoZlist';
import ListItem from './listItem';
import Header from './Header';

import { defaultNavStyles } from 'styles';
import Locale from 'utils/locale';
import styles from './styles';

const matchesLowerText = compose(contains, toLower);
const filterList = predicate => filter(compose(predicate, toLower, propOr('', ['description'])));
const sortByDescription = (data, sortable) => (sortable ? sortBy(prop('description'))(data) : data);
const prepareInitialSelected = selected =>
  reduce((acc, val) => {
    if (val) acc[val] = true;
    return acc;
  }, {})(selected.split('|'));
const prepareFinalSelected = compose(join('|'), compose(keys, filter(equals(true))));

const SaveAndGoBack = ({ onPress }: { onPress: Function }) => (
  <View style={styles.saveContainer}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {Locale.translate('PickupForm.childData.SaveAndGoBack')}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

type Props = {
  data: Object,
  navigator: Object,
  handleOnSelect: () => any,
  multiselect: boolean,
  key1: string,
  value: string,
  sortable: true | false,
  scrollOnSave: Object,
};
class ChildData extends React.Component<Props> {
  static defaultProps = {
    value: '',
  };
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'back',
        title: 'BACK',
      },
    ],
    rightButtons: [
      {
        id: 'clear',
        title: 'CLEAR',
      },
    ],
  };

  constructor(props) {
    super(props);
    const sortedData = sortByDescription(this.props.data, this.props.sortable);
    this.state = {
      filter: '',
      dataSource: sortedData,
      sortedData,
      selected: prepareInitialSelected(this.props.value),
    };
    this.isViewLocked = false;

    const { navigator } = this.props;
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const sortedData = sortByDescription(nextProps.data, nextProps.sortable);
      this.setState({
        dataSource: filterList(matchesLowerText(this.state.filter))(sortedData),
        sortedData,
      });
    }
  }
  onSelection = (value) => {
    this.setState(
      {
        selected: {
          ...(this.props.multiselect ? this.state.selected : {}),
          [value]: !pathOr(false, ['selected', value], this.state),
        },
      },
      () => {
        if (!this.props.multiselect && this.state.selected[value]) {
          this.handleSubmitSelection();
        }
      },
    );
  };

  onNavigatorEvent(event) {
    const { navigator } = this.props.navigator;
    switch (event.id) {
      case 'sideMenu':
        navigator.toggleDrawer({ side: 'right' });
        break;
      case 'clear':
        this.setState({ selected: {} }, () => {
          if (!this.props.multiselect) this.handleSubmitSelection();
        });
        break;
      case 'backPress':
      case 'back':
        this.handleSubmitSelection();
        break;
      default:
      // console.log('unhandled event', event.id);
    }
  }
  handleSubmitSelection = debounce(
    () => {
      const value = prepareFinalSelected(this.state.selected);
      this.props.handleOnSelect(this.props.key1, value, this.props.scrollOnSave);
      this.props.navigator.pop({
        animated: true,
        animationType: 'slide-horizontal',
      });
    },
    400,
    true,
  );
  filterData = (text) => {
    this.setState({
      filter: text,
      dataSource: filterList(matchesLowerText(text))(this.state.sortedData),
    });
  };

  clearFilter = () => {
    this.setState({ filter: '', dataSource: this.state.sortedData });
  };
  renderItem = ({ item }) => (
    <ListItem
      code={item.code}
      description={item.description}
      hexcode={item.hexcode}
      selected={this.state.selected[item.code]}
      onPress={this.onSelection}
    />
  );

  render() {
    const renderIfMultiSelect = renderIf(this.props.multiselect);
    return (
      <View style={styles.container}>
        <Header
          multiselect={this.props.multiselect}
          filter={this.state.filter}
          filterData={this.filterData}
          clearFilter={this.clearFilter}
        />
        <AtoZlist
          sortable={this.props.sortable}
          data={this.state.dataSource}
          renderItem={this.renderItem}
          letterStyle={styles.letterStyle}
          highlightedLetterStyle={styles.highlightedLetter}
          getItemHeight={() => 41}
        />
        {renderIfMultiSelect(<SaveAndGoBack onPress={this.handleSubmitSelection} />)}
      </View>
    );
  }
}

export default ChildData;
