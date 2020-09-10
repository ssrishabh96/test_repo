import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import renderIf from 'render-if';

import icons from 'constants/icons';

import styles from './styles';
import Locale from 'utils/locale';

type Props = {
  +resetSearchBar: () => any,
  +setSearchQuery: () => any,
  +onSubmit: () => any,
  +query?: string,
  +placeholder?: string,
  +clearOnSubmit?: boolean,
  +showCancel?: boolean,
};
const defaultProps = {
  query: '',
  showCancel: true,
  onSubmit: () => null,
  setSearchQuery: () => null,
};
class SearchBar extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = { value: props.query };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({ value: nextProps.query });
    }
  }
  submit = () => {
    this.props.onSubmit(this.state.value);
    if (this.props.clearOnSubmit) {
      this.setState({ value: this.props.query });
    }
  };
  handleChange = (value) => {
    this.setState({ value }, () => {
      this.props.setSearchQuery(this.state.value);
    });
  };
  reset = () => {
    this.setState({ value: this.props.query }, () => {
      this.props.resetSearchBar();
    });
  };
  render() {
    const { showCancel } = this.props;
    const renderCancel = renderIf(showCancel);
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity onPress={this.submit}>
          <Image
            source={icons.tripsScreen.tripIconSearch}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          defaultValue={this.props.query}
          value={this.state.value}
          style={styles.textInputContainer}
          placeholder={this.props.placeholder || `${Locale.translate('search.lotNumber')}`}
          onChangeText={this.handleChange} // eslint-disable-line
          onSubmitEditing={(event) => {
            this.setState({ value: event.nativeEvent.text }, () => {
              this.submit();
            });
          }}
          underlineColorAndroid="transparent"
        />
        {renderCancel(
          <TouchableOpacity
            style={styles.button}
            onPress={this.reset}
          >
            <Text style={styles.cancel}>{Locale.translate('Cancel')}</Text>
          </TouchableOpacity>,
        )}
      </View>
    );
  }
}
SearchBar.defaultProps = defaultProps;

export default SearchBar;
