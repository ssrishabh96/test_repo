// @flow

import type Lot from 'types/Lot';

import React from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import {
  sort,
  reverse,
  identity,
  ascend,
  prop,
  map,
  addIndex,
  over,
  lensProp,
  compose,
  assoc,
} from 'ramda';
import moment from 'moment';

import SearchBar from 'components/custom/SearchBar';
import SortModal from 'components/custom/SortModal';
import InlineLoader from 'components/custom/FullScreenLoader/InlineLoader';
import IconButton from 'components/core/Button/IconButton';

import styled from 'styled-components/native';
import { defaultNavStyles } from 'styles';
import colors from 'styles/colors';

import icons from 'constants/icons';

import ListItem from './components/ListItem';
import Locale from '../../utils/locale';

import { lotNotesViewSelector } from 'views/lotview/lotview.redux';

const formatDate = (date: string) => {
  const momentDate = moment(date, ['YYYY-MM-DD HH:mm:ss +-Z', moment.ISO_8601]);
  return momentDate;
};

const sortByCreationDate = sort(ascend(prop('createTime')));

const convertNotes = addIndex(map)((n: Note, i: number) =>
  compose(assoc('key', i), over(lensProp('createTime'), formatDate))(n),
);
const sortAndConvertNotes = (dir: 'asc' | 'desc', notes: Note[]) =>
  compose(dir === 'desc' ? reverse : identity, sortByCreationDate, convertNotes)(notes);

type Props = {
  +navigator: {
    +setOnNavigatorEvent: () => any,
    +dismissModal: () => any,
  },
  +lot: Lot,
  +notes: Note[],
  +buttonLabel?: string,
  +handleButtonPress: () => any,
  isLoading: boolean,
};
type NavigationEvent = {
  +type: string,
  +id: string,
};
type Note = {
  +lotNumber: string,
  +auto_mobile_code: string,
  +notes: string,
  +user_id: string,
  +work_station: string,
  +createTime: string,
  +key?: number,
};
const RoundButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 45;
  border-radius: 22.5;
  padding: 5px;
  background-color: ${colors.COPART_BLUE};
`;
const defaultProps = {
  notes: [],
  isLoading: false,
};
class LotNotes extends React.Component<Props> {
  static defaultProps = defaultProps;
  static navigatorStyle = defaultNavStyles;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
    rightButtons: [
      {
        id: 'search',
        icon: icons.tripsScreen.tripIconSearch,
      },
    ],
  };
  constructor(props: Props) {
    super(props);
    const notes = sortAndConvertNotes('asc', props.notes);
    this.state = {
      searchVisible: false,
      searchValue: '',
      sortVisible: false,
      sortDirection: 'asc',
      filteredNotes: notes,
      allNotes: notes,
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.notes !== nextProps.notes) {
      const notes = sortAndConvertNotes(this.state.sortDirection, nextProps.notes);
      this.setState({
        searchVisible: false,
        searchValue: '',
        filteredNotes: notes,
        allNotes: notes,
      });
    }
  }
  onNavigatorEvent(event: NavigationEvent) {
    if (event.type === 'NavBarButtonPress') {
      // this is the event type for button presses
      if (event.id === 'cancel') {
        // this is the same id field from the static navigatorButtons definition
        this.props.navigator.dismissModal();
      }
      if (event.id === 'search') {
        this.setState({
          searchVisible: true,
        });
      }
    }
  }
  toggleSearchVisible = () => {
    this.setState({
      searchVisible: !this.state.searchVisible,
      searchValue: '',
      filteredNotes: this.state.allNotes,
    });
  };
  toggleSortVisibility = () => {
    this.setState({ sortVisible: !this.state.sortVisible });
  };
  sortNotes = (direction: 'asc' | 'desc') => {
    this.setState({
      sortVisible: false,
      sortDirection: direction,
      filteredNotes: (direction !== this.state.sortDirection ? reverse : identity)(
        this.state.filteredNotes,
      ),
      allNotes: (direction !== this.state.sortDirection ? reverse : identity)(this.state.allNotes),
    });
  };
  handleSearchQuery = (searchValue: string) => {
    const filteredNotes = this.state.allNotes.filter(
      (note: Note) =>
        note.user_id.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1 ||
        note.notes.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1,
    );
    this.setState({ searchValue, filteredNotes });
  };
  render() {
    const { isLoading } = this.props;
    const renderIfButtonTypeProceed = renderIf(this.props.buttonLabel === 'Proceed');
    const actionButton = (
      <RoundButton
        style={styles.button}
        onPress={() => {
          this.props.handleButtonPress(this.props.navigator);
        }}
      >
        <Text style={styles.buttonLabel}>{this.props.buttonLabel}</Text>
      </RoundButton>
    );

    if (isLoading) {
      return (
        <View>
          <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
            <InlineLoader />
          </View>
          {actionButton}
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {this.state.searchVisible ? (
          <SearchBar
            resetSearchBar={this.toggleSearchVisible}
            setSearchQuery={this.handleSearchQuery}
            placeholder="Search"
          />
        ) : (
          <View style={styles.header}>
            <Text style={styles.title}>LOT #{this.props.lot.number}</Text>
            {renderIfButtonTypeProceed(
              <Text style={[styles.title, { color: 'yellow' }]}>
                {Locale.translate('PickupForm.ScrollInfo')}
              </Text>,
            )}
            <IconButton
              icon={icons.tripsScreen.tripIconSort}
              styles={{
                width: 19,
                height: 21,
              }}
              onPress={this.toggleSortVisibility}
            />
          </View>
        )}
        {this.state.allNotes.length > 0 ? (
          <FlatList
            data={this.state.filteredNotes}
            renderItem={({ item, index }: { item: Object, index: number }) => (
              <ListItem
                key={item.key}
                note={item}
                isEvenRow={index % 2 === 0}
              />
            )}
            ListFooterComponent={actionButton}
          />
        ) : (
          <View>
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>Notes are not available</Text>
            {actionButton}
          </View>
        )}
        <SortModal
          type={'lotNotes'}
          isModalVisible={this.state.sortVisible}
          selectedItem={this.sortNotes}
          cancelSort={this.toggleSortVisibility}
          selectedField={this.state.sortDirection}
          hideClear
        />
      </View>
    );
  }
}
const styles = {
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    backgroundColor: colors.SECTION_HEADER_BG,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    height: 44,
    paddingTop: 15,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  button: { margin: 10 },
  buttonLabel: {
    margin: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {},
};

export default connect(lotNotesViewSelector)(LotNotes);
