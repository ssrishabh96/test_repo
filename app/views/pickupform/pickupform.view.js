import React, { Component } from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import renderIf from 'render-if';
import _ from 'lodash';
import { processFields } from 'form-metadata';
import RNFS from 'react-native-fs';
import { isEmpty } from 'ramda';
import Locale from 'utils/locale';
import ImagePicker from 'react-native-image-picker';
import StepIndicator from 'react-native-step-indicator';
import FullScreenLoader from 'components/custom/FullScreenLoader';
import SubmittingView from './components/SubmittingView';
import FormList from './components/FormList';
import ImagePreviewModal from './components/ImagePreview';
import IconButton from 'components/core/Button/IconButton';
import FormFooterInfo from './components/FormFooterInfo';

// import icons from 'constants/icons';
// import api from './api/pickupapi';
import Lot from 'types/Lot';
import colors from 'styles/colors';
import icons from 'constants/icons';
import { validateStep } from './pickupformValidations';
import { getLotTripTypeInfo } from 'constants/tripTypeMap';
import { getConnectionStatus } from 'views/settings/settings.redux';

import {
  setCurrentPickupLot,
  clearCurrentPickupLot,
  incrementCurrentStep,
  decrementCurrentStep,
  resetCurrentStep,
  setCurrentItemValue,
  updatePickupLotData,
  updateWarningFlags,
  setFormSubmitting,
  showHideImagePreview,
  uploadPickupForm,
  cacheCurrentForm,
  goToStep,
} from './pickupform.action';

import { Step, DataSource, ReferenceCodes } from './pickupformTypes';
// import { bool } from 'prop-types';

const pickupIndicatorStyles = {
  labelSize: 12,
  stepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  stepIndicatorLabelFontSize: 15,
  labelColor: '#666666',

  currentStepStrokeWidth: 3,
  currentStepIndicatorSize: 40,
  currentStepIndicatorLabelFontSize: 15,
  currentStepLabelColor: colors.COPART_BLUE,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorCurrentColor: '#ffffff',
  stepStrokeCurrentColor: colors.COPART_BLUE,

  separatorFinishedColor: colors.COPART_BLUE,
  stepIndicatorFinishedColor: colors.COPART_BLUE,
  stepIndicatorLabelFinishedColor: '#ffffff',

  separatorUnFinishedColor: '#54a5ff',
  stepIndicatorUnFinishedColor: '#54a5ff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
};
type NavigationEvent = {
  +type: string,
  +id: string,
};
type PickerData = Array<{ code: string, description: string }>;
type Props = {
  +lot: Lot,
  +currentStep?: number,
  +tripType: string,
  +currentPickupLot: Lot,
  +dataSource: DataSource,
  +referenceCodes: ReferenceCodes,
  +showImagePreview: boolean,
  +imagePreview: Object,
  +isSubmitting: boolean,
  +submittingStatus: string,
  +connectionStatus: boolean,
  +navigator: {
    +setOnNavigatorEvent: () => any,
    +setButtons: () => any,
    +dismissModal: () => any,
    +push: () => any,
    +showModal: () => any,
    showInAppNotification: () => any,
  },
  +incrementCurrentStep: () => any,
  +decrementCurrentStep: () => any,
  +setCurrentPickupLot: () => any,
  +updateWarningFlags: () => any,
  +setFormSubmitting: () => any,
  +goBackFromLotView: () => any,
  +resetCurrentStep: () => any,
  +updatePickupLotData: () => any,
  +showHideImagePreview: () => any,
  +uploadPickupForm: () => any,
  +cacheCurrentForm: () => any,
  +restart: true | false,
  +goToStep: () => any,
};
const LotNotesButton = ({ handlePressLotNotes }) => (
  <TouchableOpacity
    onPress={handlePressLotNotes}
    style={{ paddingTop: 5, paddingLeft: 10 }}
  >
    <Icon
      size={30}
      name={'file-text-o'}
      color={colors.COPART_BLUE}
    />
  </TouchableOpacity>
);
export class PickupFormContainer extends Component<Props> {
  static defaultProps = {
    currentStep: 0,
    submitting: false,
  };

  static navigatorStyle = {
    navBarBackgroundColor: colors.COPART_BLUE,
    navBarTextColor: '#fff',
    navBarButtonColor: '#fff',
    navBarNoBorder: true,
  };

  static navigatorButtons = {
    rightButtons: [
      {
        id: 'cancel',
        title: 'Close',
      },
    ],
  };

  constructor(props: Props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.props.setCurrentPickupLot(this.props.lot, this.props.charges, this.props.restart);
  }

  componentWillUnmount() {
    this.props.clearCurrentPickupLot();
  }

  onNext = () => {
    const { currentStep, currentPickupLot } = this.props;
    const isOnLastStep = currentStep === getLotTripTypeInfo(currentPickupLot).formStepCount - 1;

    if (isOnLastStep) {
      if (this.validateWholeForm()) {
        // if whole form is valid
        this.submitForm();
      }
    } else if (this.validateCurrentStep()) {
      // if current step is valid
      this.scrollToTop();
      this.props.incrementCurrentStep();
    }
  };

  onBack = () => {
    // console.log('Pickup order handleBack');
    this.scrollToTop();
    this.props.decrementCurrentStep();
  };

  onPressPage = (page) => {
    this.scrollToTop();
    this.props.goToStep(page);
  };

  onNavigatorEvent(event: NavigationEvent) {
    if (event.type === 'NavBarButtonPress') {
      // this is the event type for button presses
      if (event.id === 'cancel' && !this.props.isSubmitting) {
        // this is the same id field from the static navigatorButtons definition
        const cancel = { text: 'cancel', onPress: () => null };
        const discard = {
          text: 'discard',
          onPress: () => {
            this.props.resetCurrentStep();
            this.props.navigator.dismissModal();
          },
          style: 'destructive',
        };
        const save = {
          text: 'save',
          onPress: () => {
            this.props.cacheCurrentForm(this.props.currentPickupLot);
            this.props.resetCurrentStep();
            this.props.navigator.dismissModal();
          },
        };
        Alert.alert('Would you like to save your changes?', null, [cancel, discard, save]);
      }
    }
    if (event.id === 'backPress' && !this.props.isSubmitting) {
      this.onBack();
    }
  }

  scrollToTop = () => {
    this.sectionlist.scrollToLocation({
      animated: false,
      itemIndex: 0,
      sectionIndex: 0,
      viewOffset: 40,
    });
  };

  validateWholeForm = (): boolean => {
    const { steps, currentPickupLot } = this.props;
    let foundRequired = false;
    let items;
    let step = 0;
    while (!foundRequired && step < steps.length) {
      const convertedStep = convertData(steps[step]);
      const result = validateStep(convertedStep, currentPickupLot);
      foundRequired = result.foundRequired;
      items = result.items;
      if (!foundRequired) step += 1;
    }
    if (foundRequired) {
      this.onPressPage(step);
      setTimeout(() => {
        this.sectionlist.scrollToLocation({
          animated: true,
          sectionIndex: items[0].section,
          itemIndex: items[0].item,
          viewOffset: Platform.OS === 'ios' ? 40 : 0,
        });
      }, 100);
      this.props.updateWarningFlags(items, true);
    }
    return !foundRequired;
  };

  validateCurrentStep = (): boolean => {
    const { foundRequired, items } = validateStep(
      this.props.dataSource,
      this.props.currentPickupLot,
    );
    if (foundRequired) {
      this.sectionlist.scrollToLocation({
        animated: true,
        sectionIndex: items[0].section,
        itemIndex: items[0].item,
        viewOffset: Platform.OS === 'ios' ? 40 : 0,
      });
      this.props.updateWarningFlags(items, true);
    }
    return !foundRequired;
  };

  submitForm = () => {
    const { navigator, connectionStatus, lot, goBackFromLotView, currentPickupLot } = this.props;
    if (!connectionStatus) {
      this.props.cacheCurrentForm(currentPickupLot, true);
      navigator.dismissModal();
      navigator.handleDeepLink({
        link: 'popTo/lotList',
      });
      setTimeout(() => {
        this.props.navigator.showInAppNotification({
          screen: 'CopartTransporter.ShowInAppNotification',
          passProps: {
            type: 'success',
            content: 'Form saved in queue, awaiting sync.',
          },
        });
      }, 400);
    } else {
      navigator.setButtons({ rightButtons: [] }); // remove buttons
      const data = { props: this.props, lot, navigator, goBackFromLotView };

      this.props
        .uploadPickupForm(currentPickupLot, data)
        .then(() => {
          navigator.dismissModal();
          navigator.handleDeepLink({
            link: 'popTo/lotList',
          });
        })
        .finally(() => {
          navigator.setButtons({
            rightButtons: [
              {
                id: 'cancel',
                title: 'Close',
              },
            ],
          });
        });
    }
  };

  openPicker = (
    label: string,
    data: PickerData,
    key1: string,
    required: boolean,
    multiselect: boolean,
    sortable: true | false,
    scrollOnSave: Object,
  ) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.ChildData',
      title: label,
      overrideBackPress: true,
      passProps: {
        handleOnSelect: this.handleOnSelect,
        value: this.props.currentPickupLot[key1],
        data,
        key1,
        required,
        multiselect,
        scrollOnSave,
        sortable,
      },
    });
  };

  openCamera = (
    key: string,
    value: string,
    handleOnSelect: () => any,
    type: string,
    documentType: string,
    replaceItem: object,
  ) => {
    const options = {
      quality: 1.0,
      maxWidth: 640,
      maxHeight: 480,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.launchCamera(options, (response) => {
      if (!response.didCancel) {
        const image = { encoded: '', pathName: response.uri };
        let newValue;
        if (type === 'multiImage') {
          if (replaceItem) {
            const index = value.indexOf(replaceItem);
            newValue = [...value];
            RNFS.unlink(replaceItem.image.pathName)
              .then(() => {})
              .catch(() => {});
            newValue[index] = {
              key: replaceItem.key,
              documentType,
              key1: key,
              type,
              image,
            };
          } else if (value && value.length > 0) {
            newValue = [...value];
            newValue.push({
              key: newValue[newValue.length - 1].key + 1,
              documentType,
              key1: key,
              type,
              image,
            });
          } else newValue = [{ key: 0, documentType, key1: key, type, image }];
        } else {
          /* Note :- response.isVertical return true for landscape picture */
          if (response.isVertical) {
            const imageRatio = response.width / response.height;
            if (imageRatio !== 1.3333333333333333) {
              Alert.alert(
                Locale.translate('camera.orientation.warning.title'),
                Locale.translate('camera.orientation.image.dimension'),
                [
                  {
                    text: Locale.translate('camera.orientation.ok'),
                  },
                ],
              );
              return;
            }
          } else {
            Alert.alert(
              Locale.translate('camera.orientation.warning.title'),
              Locale.translate('camera.orientation.message'),
              [
                {
                  text: Locale.translate('camera.orientation.ok'),
                },
              ],
            );
            return;
          }
          newValue = { key: 0, encoded: '', pathName: response.uri, documentType, key1: key, type };
        }
        handleOnSelect(key, newValue);
      }
    });
  };

  closePreview = () => {
    this.props.showHideImagePreview(false);
  };

  handlePreviewClick = (key: string, item) => {
    const path = item ? item.image.pathName : this.props.currentPickupLot[key].pathName;
    const imagePreview = {
      showImagePreview: true,
      previewPath: path,
      key,
      selectedMultiImageItem: item,
    };
    this.props.showHideImagePreview(true, imagePreview);
  };

  deleteImagePreview = (imagePath: string, imagePreview: Object) => {
    RNFS.unlink(imagePath)
      .then(() => {})
      .catch(() => {});

    if (imagePreview.selectedMultiImageItem) {
      const imageList = this.props.currentPickupLot[imagePreview.key];
      const newValue = imageList.splice(imageList.indexOf(imagePreview.selectedMultiImageItem), 1);
      this.handleOnSelect(imagePreview.key, imageList && imageList.length > 0 ? imageList : null);
    } else {
      this.handleOnSelect(imagePreview.key, '');
    }
    this.closePreview();
  };

  showSignatureView = (label: string, key1: string) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.Signature',
      title: label,
      passProps: {
        handleOnSelect: this.handleOnSelect,
        key1,
      },
    });
  };

  showScannerView = (label, key1) => {
    this.props.navigator.push({
      screen: 'CopartTransporter.ScannerView',
      title: 'Scan',
      passProps: {
        onBarCodeRead: this.handleOnSelect,
        key1,
      },
    });
  };

  showWarningNotification = (item: { label: string }) => {
    this.props.navigator.showInAppNotification({
      screen: 'CopartTransporter.ShowInAppNotification',
      passProps: {
        type: 'warning',
        content: `Please fill required item ${item.label}`,
      },
      autoDismissTimerSec: 1,
    });
  };

  showWarningCountNotification = (items: Array<{ label: string }>) => {
    this.props.navigator.showInAppNotification({
      screen: 'CopartTransporter.ShowInAppNotification',
      passProps: {
        type: 'warning',
        content: `${items[0].label} and ${items.length - 1} other required fields are missing.`,
      },
      autoDismissTimerSec: 1,
    });
  };

  handleOnSelect = (key: string, value: string, scrollOnSave: Object) => {
    if (scrollOnSave) {
      this.sectionlist.scrollToLocation({ viewOffset: 40, ...scrollOnSave });
    }
    value && value !== '' && this.props.updateWarningFlags([{ key1: key }], false); // eslint-disable-line
    this.props.updatePickupLotData(key, value);
  };

  handleDateChange = (key: string, date: string) => {
    this.props.updatePickupLotData(key, date);
  };

  handlePressLotNotes = () => {
    this.props.navigator.showModal({
      screen: 'CopartTransporter.LotNotes',
      title: 'Lot Notes',
      passProps: {
        lot: this.props.lot,
        goBackFromLotView: this.props.goBackFromLotView,
        buttonLabel: 'Dismiss',
        handleButtonPress: navi => navi.dismissModal({}),
      },
    });
  };
  handlePressLotInfo = () => {
    const { lot } = this.props;
    this.props.navigator.showModal({
      screen: 'CopartTransporter.LotInfoView',
      title: 'Lot Info',
      passProps: {
        lot,
      },
    });
  };

  render() {
    if (isEmpty(this.props.currentPickupLot)) {
      return <FullScreenLoader />;
    }
    if (this.props.isSubmitting) {
      return <SubmittingView status={this.props.submittingStatus} />;
    }
    return (
      <View style={styles.mainviewStyle}>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            borderBottomColor: colors.GRAY_LIGHT,
            borderBottomWidth: 1,
          }}
        >
          <LotNotesButton handlePressLotNotes={this.handlePressLotNotes} />
          <View style={{ flex: 1 }}>
            <StepIndicator
              customStyles={pickupIndicatorStyles}
              currentPosition={this.props.currentStep}
              stepCount={getLotTripTypeInfo(this.props.currentPickupLot).formStepCount}
              onPress={this.onPressPage}
            />
          </View>
          <IconButton
            styles={{ tintColor: colors.COPART_BLUE, width: 30, height: 30 }}
            containerStyle={{ marginVertical: 5 }}
            icon={icons.infoIcon}
            onPress={this.handlePressLotInfo}
          />
        </View>
        <FormFooterInfo lot={this.props.lot} />
        <FormList
          onRef={(ref) => {
            this.sectionlist = ref;
          }}
          data={this.props.dataSource}
          handleOnSelect={this.handleOnSelect}
          currentPickupLot={this.props.currentPickupLot}
          updatePickupLotData={this.props.updatePickupLotData}
          openPicker={this.openPicker}
          showSignatureView={this.showSignatureView}
          referenceCodes={this.props.referenceCodes}
          showWarningNotification={this.showWarningNotification}
          openCamera={this.openCamera}
          showScannerView={this.showScannerView}
          handlePreviewClick={this.handlePreviewClick}
        />

        {this.props.showImagePreview ? (
          <ImagePreviewModal
            modalId={'imagePreview'}
            showPreview={this.props.showImagePreview}
            closePreview={this.closePreview}
            imagePreview={this.props.imagePreview}
            deleteImagePreview={this.deleteImagePreview}
          />
        ) : null}
        <View style={styles.footer}>
          {this.props.currentStep !== 0 ? (
            <TouchableHighlight
              style={styles.bottomBarButton}
              onPress={this.onBack}
              underlayColor={'transparent'}
            >
              <Text style={styles.footerText}>{'Back'}</Text>
            </TouchableHighlight>
          ) : (
            <View style={styles.bottomBarButton} />
          )}
          <TouchableHighlight
            style={styles.bottomBarButton}
            onPress={this.onNext}
            underlayColor={'transparent'}
          >
            <Text style={styles.footerText}>
              {this.props.currentStep ===
              getLotTripTypeInfo(this.props.currentPickupLot).formStepCount - 1
                ? 'Submit'
                : 'Next'}
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainviewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  footer: {
    left: 0,
    right: 0,
    backgroundColor: colors.COPART_BLUE,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
  },
  bottomBarButton: {
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  footerText: {
    color: 'white',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    bottom: 2,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange',
  },
  scrollViewStyle: {
    backgroundColor: 'red',
  },
});

export const convertData = (data: { [string]: Step[] }): DataSource => {
  const formData = data;
  const keysSteps = Object.keys(formData);
  const SERVICE_PATHS = {};
  const newObj = {};
  keysSteps && // eslint-disable-line
    keysSteps.forEach((d) => {
      formData[d].forEach((e) => {
        const a = JSON.parse(JSON.stringify(e));
        a.id = e.id.toString();
        a.value = e.value || '';
        newObj[e.id.toString()] = a;
        const array = [];
        array.push(e.id.toString());
        SERVICE_PATHS[e.id.toString()] = array;
      });
    });

  const { fields } = processFields(newObj, SERVICE_PATHS);
  const newdata = Object.values(fields);

  let dataSource = _.groupBy(newdata, d => d.section);

  dataSource = _.reduce(
    dataSource,
    (acc, next, index) => {
      acc.push({
        key: index,
        data: next,
      });
      return acc;
    },
    [],
  );
  return dataSource;
};
const mapDispatchToProps = {
  setCurrentPickupLot,
  clearCurrentPickupLot,
  incrementCurrentStep,
  decrementCurrentStep,
  resetCurrentStep,
  setCurrentItemValue,
  updatePickupLotData,
  updateWarningFlags,
  setFormSubmitting,
  showHideImagePreview,
  uploadPickupForm,
  cacheCurrentForm,
  goToStep,
};
const mapStateToProps = state => ({
  currentStep: state.pickUpForm.currentStep,
  currentPickupLot: state.pickUpForm.currentPickupLot,
  isLoading: state.pickUpForm.isLoading,
  dataSource: convertData(state.pickUpForm.steps[state.pickUpForm.currentStep]),
  steps: state.pickUpForm.steps,
  referenceCodes: state.pickUpForm.referenceCodes,
  showImagePreview: state.pickUpForm.showImagePreview,
  // imagePreviewPath: state.pickUpForm.imagePreviewPath,
  imagePreview: state.pickUpForm.imagePreview,
  isSubmitting: state.pickUpForm.isSubmitting,
  submittingStatus: state.pickUpForm.submittingStatus,
  connectionStatus: getConnectionStatus(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(PickupFormContainer);
