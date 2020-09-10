import React, { Component } from 'react';
// import { groupBy, compose, map, evolve, zipObj, toPairs, pathOr, tap } from 'ramda';

import { View, Text } from 'react-native';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';

import LabelItem from '../FormItems/labelItem';
import TextItem from '../FormItems/textItem';
import VinItem from '../FormItems/vinItem';
import ButtonsItem from '../FormItems/buttonsItem';
import MultiImageItem from '../FormItems/multiImageItem';
import ImageItem from '../FormItems/imageItem';
import CommentsItem from '../FormItems/commentsItem';
import DateItem from '../FormItems/dateItem';
import AccessoryItem from '../FormItems/accessoryItem';
import SignatureItem from '../FormItems/signatureItem';
import colors from '../../../../styles/colors';

import { DataSource, ReferenceCodes } from '../../pickupformTypes';

export default class FormList extends Component {
  static propTypes = {
    handleOnSelect: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired, // eslint-disable-line
    onRef: PropTypes.func.isRequired,
    openPicker: PropTypes.func.isRequired,
    openCamera: PropTypes.func.isRequired,
    handlePreviewClick: PropTypes.func.isRequired,
    showWarningNotification: PropTypes.func.isRequired,
    showSignatureView: PropTypes.func.isRequired,
    showScannerView: PropTypes.func.isRequired,
    updatePickupLotData: PropTypes.func.isRequired,
    referenceCodes: PropTypes.shape(ReferenceCodes).isRequired,
  };
  componentDidMount() {
    this.props.onRef(this.sectionref);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }
  renderItem = (item) => {
    if (!item.item.readable) return false;
    switch (item.item.type) {
      case 'label':
        return (
          <LabelItem
            key={item.item.field}
            {...item.item}
            currentPickupLot={this.props.currentPickupLot}
          />
        );
      case 'accessory':
        return (
          <AccessoryItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            currentPickupLot={this.props.currentPickupLot}
            handleOnSelect={this.handleOnSelect}
            referenceCodes={this.props.referenceCodes}
            openPicker={this.props.openPicker}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'text':
        return (
          <TextItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'buttons':
        return (
          <ButtonsItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            currentPickupLot={this.props.currentPickupLot}
            handleOnSelect={this.props.handleOnSelect}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'comments':
        return (
          <CommentsItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'date':
        return (
          <DateItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleDateChange={this.props.handleOnSelect}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'signature':
        return (
          <SignatureItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            showSignatureView={this.props.showSignatureView}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'multiImage':
        return (
          <MultiImageItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            openCamera={this.props.openCamera}
            handlePreviewClick={this.props.handlePreviewClick}
            showWarningNotification={this.props.showWarningNotification}
            documentType={item.item.documentType}
          />
        );
      case 'image':
        return (
          <ImageItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            openCamera={this.props.openCamera}
            handlePreviewClick={this.props.handlePreviewClick}
            showWarningNotification={this.props.showWarningNotification}
            documentType={item.item.documentType}
          />
        );
      case 'vin':
        return (
          <VinItem
            key={item.item.field}
            {...item.item}
            value={this.props.currentPickupLot[item.item.key1]}
            handleOnSelect={this.props.handleOnSelect}
            showScannerView={this.props.showScannerView}
            showWarningNotification={this.props.showWarningNotification}
          />
        );
      case 'bottomBuffer':
        return <View style={{ height: 90 }} />;
      default:
        return null;
    }
  };

  renderHeader = headerItem => (
    <Text
      style={[
        {
          padding: 8,
          fontSize: 14,
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: colors.SECTION_HEADER_BG,
        },
      ]}
    >
      {headerItem.section.key.toUpperCase()}
    </Text>
  );

  render() {
    const { data } = this.props;
    if (!data) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <KeyboardAwareSectionList
        innerRef={(ref) => {
          this.sectionref = ref;
        }}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderHeader}
        sections={data}
      />
    );
  }
}
