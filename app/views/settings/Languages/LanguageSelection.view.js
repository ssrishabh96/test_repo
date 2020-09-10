import React, { Component } from 'react';
import { FlatList, View, TouchableHighlight, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import languageData from './languageData';
import Locale from '../../../utils/locale';
import { changeLanguageSettings } from '../settings.action';
import styles from '../settings.style';
import icons from 'constants/icons';

class SettingLanguages extends Component {
  onSelectLangClick = (data) => {
    this.props.changeLanguageSettings(data.languageCode, data.languageName);
  };

  ItemRow = ({ item, label, onPress }) => (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={onPress}
    >
      <View style={[styles.itemWrapper]}>
        <Text style={styles.flatListKeyItemStyle}>{label}</Text>
        <View style={styles.iconViewStyle}>
          <Image
            style={{
              height: 35,
              width: 30,
            }}
            resizeMode="contain"
            source={this.props.language === item.languageCode ? icons.navIconAcceptedActive : null}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={languageData.availableLanguages.US}
          renderItem={({ item }) => (
            <this.ItemRow
              item={item}
              label={item.languageName}
              onPress={() => this.onSelectLangClick(item)}
              keyExtractor={item.countryCode}
            />
          )}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  changeLanguageSettings,
};

const mapStateToProps = state => ({
  language: state.settings.languageCode,
});
export default connect(mapStateToProps, mapDispatchToProps)(SettingLanguages);
