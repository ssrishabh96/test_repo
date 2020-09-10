import React from 'react';
import { View, SectionList, StyleSheet, Dimensions } from 'react-native';
import renderIf from 'render-if';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TouchableAlphabet from './touchableAlphabet';
import {
  groupBy,
  compose,
  toPairs,
  map,
  head,
  toUpper,
  propOr,
  ifElse,
  identity,
  test,
} from 'ramda';

const NavBarHeight = 54;
const ScreenHeight = Dimensions.get('window').height - NavBarHeight;
const getLetterOrHash = ifElse(test(/[a-z]/i), identity, () => '#');
const getFirstLetter = compose(toUpper, getLetterOrHash, head, propOr('', ['description']));
const groupByFirstLetter = groupBy(getFirstLetter);
const transformToSectionList = map(([letter, data]) => ({ letter, data }));
const getSectionListFromData = compose(transformToSectionList, toPairs, groupByFirstLetter);

const getInitialNumToRender = (itemHeight, flatData, sectionedData) => {
  const itemsPerScreenHeight = Math.ceil(ScreenHeight / itemHeight);
  if (itemsPerScreenHeight < flatData.length) {
    const letter = flatData[itemsPerScreenHeight - 1].description[0].toUpperCase();
    let numberOfSections = 0;
    while (sectionedData[numberOfSections].letter <= letter) numberOfSections += 1;

    // return 2 * number of sections (one for header one for footer) + number of items
    return numberOfSections * 2 + itemsPerScreenHeight;
  }
  // return 2 * total number of sections (one for header one for footer) + total number of items
  return sectionedData.length * 2 + flatData.length;
};

type Props = {
  +data: Object[], // alphabetically sorted
  +renderItem: () => React.Node,
  +renderSectionHeader?: () => React.Node,
  +viewOffset?: number,
  +containerStyle?: {},
  +letterStyle?: {},
  +highlightedLetterStyle?: {},
  +getItemHeight: () => number,
  +getSectionHeaderHeight?: () => number,
  +sortable: true | false,
};
class AtoZlist extends React.Component<Props> {
  static defaultProps = {
    renderSectionHeader: () => null,
    viewOffset: 0,
    letterStyle: {},
    containerStyle: {},
    highlightedLetterStyle: {},
    getSectionHeaderHeight: () => 0,
  };

  constructor(props) {
    super(props);
    this.state = { dataSource: getSectionListFromData(props.data) };
    this.initialNumToRender = getInitialNumToRender(
      props.getItemHeight(),
      props.data,
      this.state.dataSource,
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ dataSource: getSectionListFromData(nextProps.data) });
    }
  }

  initialNumToRender = 10;

  handleOnPress = (letter) => {
    if (letter) {
      let sectionIndex = 0;
      while (
        this.state.dataSource.length - 1 !== sectionIndex &&
        this.state.dataSource[sectionIndex].letter !== letter &&
        this.state.dataSource[sectionIndex].letter < letter
      ) {
        sectionIndex += 1;
      }
      this.sectionListRef.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex,
        viewOffset: this.props.viewOffset,
      });
    }
  };
  render() {
    const renderIfSortable = renderIf(this.props.sortable);
    return (
      <View style={[{ flexDirection: 'row', flex: 1 }, this.props.containerStyle]}>
        <SectionList
          ref={(ref) => {
            this.sectionListRef = ref;
          }}
          initialNumToRender={this.initialNumToRender}
          renderItem={this.props.renderItem}
          keyExtractor={item => item.code}
          renderSectionHeader={this.props.renderSectionHeader}
          sections={this.state.dataSource}
          getItemLayout={sectionListGetItemLayout({
            getItemHeight: this.props.getItemHeight,
            getSectionHeaderHeight: this.props.getSectionHeaderHeight,
          })}
        />
        {renderIfSortable(
          <TouchableAlphabet
            onTapLetter={this.handleOnPress}
            containerStyle={styles.alphabetContainerStyle}
            letterStyle={this.props.letterStyle}
            highlightedLetterStyle={this.props.highlightedLetterStyle}
          />,
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  alphabetContainerStyle: {
    position: 'absolute',
    right: 0,
    top: 5,
    bottom: 10,
  },
});
export default AtoZlist;
