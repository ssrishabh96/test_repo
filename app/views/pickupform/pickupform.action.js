import { propOr, compose, prop, defaultTo, reject, pathOr, propEq } from 'ramda';
import moment from 'moment';
// import dbquery from './database/dbquery';
import {
  PICK_FORM_SET_CURRENT_LOT,
  PICK_FORM_CLEAR_CURRENT_LOT,
  PICK_FORM_CACHE_LOT,
  PICK_FORM_CACHE_IMAGE,
  PICK_FORM_REMOVE_FROM_CACHE,
  PICK_FORM_STEP_INCREMENT,
  PICK_FORM_STEP_DECREMENT,
  PICK_FORM_RESET_STEP,
  PICK_FORM_UPDATE_LOT_DATA,
  PICK_FORM_UPDATE_WARNING,
  PICK_FORM_IMAGE_PREVIEW,
  PICK_FORM_SUBMITTING,
  PICK_FORM_SUBMIT_STATUS,
  PICK_FORM_SUBMIT_COMPLETE,
  FORM_GOTO_STEP,
} from './pickupform.constants';
import { LOTLIST_LOADED } from 'views/lotlist/lotlist.constants';
import { uploadImage, postPickupForm } from './pickupform.service';

import { removeLotInfoFromCache } from '../lotview/lotview.action';

import { getCacheForCurrentUser } from './pickupform.redux';
import { getActiveVendorId } from 'views/login/helpers/loginHelpers';
import { buildImage, buildMultiImage, prepareFormData } from './pickupform.helper';
import { getLotCharges } from 'views/lotview/lotview.service';

import { buildErrorMessage } from 'utils/mappers/errorMessageMapper';
import { getLotTripFormByType } from 'constants/tripTypeMap';

// prefils the vehicleDescCorrection with vehicleDescription
// while still mapped to different keys so changeing one does not change the other
const defaultToEmpty = defaultTo('');
const getAddress = (location) => {
  const address = `${defaultToEmpty(location.line_1)} ${defaultToEmpty(
    location.city,
  )} ${defaultToEmpty(location.state)} ${defaultToEmpty(location.zip)}`;
  return /^\s+$/.test(address) ? '' : address;
};

const byTripType = (lot) => {
  if (lot.tripType === 'P') {
    return {
      pickUpAddress: getAddress(lot.source),
      yardAddress: getAddress(lot.destination),
    };
  }
  return {
    deliveryAddress: getAddress(lot.destination),
    yardAddress: getAddress(lot.source),
  };
};
const preparePickupLot = lot => ({
  ...lot,
  ...byTripType(lot),
  vehicleDescCorrection: propOr('', 'description')(lot),
  // driverPrint: propOr('', 'responsible_party_name')(lot),
});

export const setCurrentPickupLot = (lot, charges = {}, restart = false) => (dispatch, getState) => {
  const cache = restart
    ? {}
    : propOr({}, lot.dispatch_assignment_detail_id)(getCacheForCurrentUser(getState()));
  const preparedLot = cache.lot
    ? { ...cache.lot, ...charges }
    : preparePickupLot({
      otherRefusedSign: 'No',
      transportDate: moment().format('MM/DD/YY'),
      datePickedUp: moment().format('MM/DD/YY'),
      creditCardDate: moment().format('MM/DD/YY'),
      checkTotal: `${charges.total}`,
      cashTotal: `${charges.total}`,
      creditCardTotal: `${charges.total}`,
      ...lot,
      ...charges,
    });
  console.log('?? setcurrent pickup lot', { lot, charges, preparedLot });
  const steps = JSON.parse(JSON.stringify(getLotTripFormByType(preparedLot).formSteps));
  for (let s = 0; s < steps.length; s += 1) {
    for (let i = 0; i < steps[s].vehicleDetails.length; i += 1) {
      steps[s].vehicleDetails[i].value = preparedLot[steps[s].vehicleDetails[i].key1] || '';
    }
  }
  return dispatch({
    type: PICK_FORM_SET_CURRENT_LOT,
    currentPickupLot: preparedLot,
    steps,
  });
};
export const clearCurrentPickupLot = () => ({
  type: PICK_FORM_CLEAR_CURRENT_LOT,
});

export const cacheCurrentForm = (lot, isAwaitingSync = false) => (dispatch, getState) =>
  dispatch({
    type: PICK_FORM_CACHE_LOT,
    id: lot.dispatch_assignment_detail_id,
    userId: getActiveVendorId(getState()),
    lot,
    isAwaitingSync,
  });
export const removeFormFromCache = ({ dispatch_assignment_detail_id }) => (dispatch, getState) =>
  // const userId = getActiveVendorId(getState());
  // const images = getState().pickUpForm.cache[userId][dispatch_assignment_detail_id].images;
  // console.log(images);
  dispatch({
    type: PICK_FORM_REMOVE_FROM_CACHE,
    id: dispatch_assignment_detail_id,
    userId: getActiveVendorId(getState()),
  });
export const setImageInCache = (lot, fileName, reqId) => (dispatch, getState) =>
  dispatch({
    type: PICK_FORM_CACHE_IMAGE,
    id: lot.dispatch_assignment_detail_id,
    userId: getActiveVendorId(getState()),
    fileName,
    reqId,
  });

export const incrementCurrentStep = () => ({ type: PICK_FORM_STEP_INCREMENT });

export const decrementCurrentStep = () => ({ type: PICK_FORM_STEP_DECREMENT });

export const resetCurrentStep = () => ({ type: PICK_FORM_RESET_STEP });

export const goToStep = step => ({ type: FORM_GOTO_STEP, step });

export const updatePickupLotData = (key, value) => ({
  type: PICK_FORM_UPDATE_LOT_DATA,
  key,
  value,
});

export const updateWarningFlags = (items, value) => ({
  type: PICK_FORM_UPDATE_WARNING,
  items,
  value,
});
export const setCurrentItemValue = () => (dispatch) => {
  //   dispatch({ type: RESET_MULTISELECT_MODE });
  //   dispatch({ type: CLEAR_SELECTION });
};
export const showHideImagePreview = (value: boolean, imagePreview: Object) => ({
  type: PICK_FORM_IMAGE_PREVIEW,
  value,
  imagePreview,
});

export const syncFormSubmission = (dispatch_assignment_detail_id, navigator) => (
  dispatch,
  getState,
) => {
  // console.log('in sync...');
  const lot = pathOr({}, [dispatch_assignment_detail_id, 'lot'])(
    getCacheForCurrentUser(getState()),
  );
  if (!lot) return Promise.reject({ message: 'something went wrong... lot was not in cache...' });
  // console.log('got the lot');
  return getLotCharges(dispatch_assignment_detail_id)
    .then(({ charges }) => {
      // console.log('got the charges', { charges });
      const newLot = { ...lot, ...charges };
      // console.log({ newLot });
      const data = { navigator, props: { navigator } }; // TODO fix this madness
      return dispatch(uploadPickupForm(newLot, data));
    })
    .catch((e) => {
      console.log('something went wrong...', e);
      Promise.reject({ message: 'getLotCharges probably failed' });
    });
};
export const setFormSubmitting = status => ({
  type: PICK_FORM_SUBMITTING,
  status,
});
export const setFormSubmittingStatus = status => ({
  type: PICK_FORM_SUBMIT_STATUS,
  status,
});
export const setFormSubmittingComplete = () => ({
  type: PICK_FORM_SUBMIT_COMPLETE,
});
export const uploadPickupForm = (currentPickupLot, data) => (dispatch, getState) => {
  console.log('uploading the form');
  // TODO if no network, dispatch(CACHE_LOT_WAITING_FOR_SYNC); return;
  dispatch(setFormSubmitting('Preparing form for upload.'));
  const uploadAttachment =
    (currentPickupLot.uploadAttachment && buildMultiImage(currentPickupLot.uploadAttachment)) || [];
  const attachment =
    (currentPickupLot.attachment && buildMultiImage(currentPickupLot.attachment)) || [];
  let filePaths = uploadAttachment.concat(attachment);
  if (currentPickupLot.creditCardImage) {
    filePaths = filePaths.concat(buildMultiImage(currentPickupLot.creditCardImage));
  }
  if (currentPickupLot.checkImage) {
    filePaths = filePaths.concat(buildMultiImage(currentPickupLot.checkImage));
  }
  if (currentPickupLot.vehicleImages) {
    filePaths.push(buildImage(currentPickupLot.vehicleImages));
  }
  const imageInfo = {
    lotNumber: currentPickupLot.number,
    yard: currentPickupLot.yardNumber,
    filePaths,
  };
  const files = imageInfo.filePaths || [];
  return uploadImages(files, currentPickupLot, data, dispatch, getState)
    .then((lot) => {
      dispatch(setFormSubmittingStatus('Uploading Form'));
      const sendData = prepareFormData(lot);
      return postPickupForm({
        assignmentId: lot.dispatch_assignment_detail_id,
        data: sendData,
      });
    })
    .then((response) => {
      if (response.status === 200 && response.data.status === 'success') {
        dispatch(setFormSubmittingStatus('Upload Complete.'));

        const lotList = pathOr([], ['lotlist', 'inProgress', 'lots'])(getState());
        const updatedLotList = reject(propEq('number', currentPickupLot.number))(lotList);
        dispatch({ type: LOTLIST_LOADED, bucket: 'inProgress', lots: updatedLotList });
        const messages = {
          D: 'Form submitted Successfully.\nLot is moved to completed',
          P: 'Form submitted Successfully.\nLot is moved to in transit',
        };
        setTimeout(
          () =>
            data.props.navigator.showInAppNotification({
              screen: 'CopartTransporter.ShowInAppNotification',
              passProps: {
                type: 'success',
                content: messages[currentPickupLot.formType.toUpperCase()],
              },
              autoDismissTimerSec: 3,
            }),
          400,
        );
        dispatch(resetCurrentStep());
        setTimeout(() => {
          dispatch(setFormSubmittingComplete());
        }, 2000);
        dispatch(removeLotInfoFromCache(currentPickupLot.dispatch_assignment_detail_id));
        dispatch(removeFormFromCache(currentPickupLot));
      } else {
        console.log('Submit form data failed', response);
        const errorMessage = response.errors ? response.errors : response.data.error;
        return Promise.reject(response.data);
      }
    })
    .catch((err) => {
      console.log('caught form upload error', err);
      const errorsData = pathOr(err, ['response', 'data'])(err);
      const errorMessage = buildErrorMessage(errorsData);
      dispatch(setFormSubmittingComplete());
      dispatch(cacheCurrentForm(currentPickupLot, true));
      setTimeout(
        () =>
          data.props.navigator.showInAppNotification({
            screen: 'CopartTransporter.ShowInAppNotification',
            passProps: {
              type: 'error',
              content: `Form Saved. Uploading  Failed. please try again\n ${errorMessage || ''}`,
              autoDismissTimerSec: 15,
            },
          }),
        400,
      );
      return Promise.reject(err);
    });
};

const uploadImages = (files, currentPickupLot, data, dispatch, getState, index = 0) => {
  if (index >= files.length || !files[index]) {
    dispatch(setFormSubmittingStatus('Image upload complete.'));
    return Promise.resolve(currentPickupLot);
  }
  dispatch(setFormSubmittingStatus(`Uploading image... ${index + 1} of ${files.length}`));
  const element = files[index];
  const reqID = pathOr(false, [
    currentPickupLot.dispatch_assignment_detail_id,
    'images',
    element.filename,
  ])(getCacheForCurrentUser(getState()));
  if (reqID) {
    const newLot = setImageOnLotWithRequestID(currentPickupLot, reqID, element);
    return uploadImages(files, newLot, data, dispatch, getState, index + 1);
  }
  return uploadImage(element, currentPickupLot.dispatch_assignment_detail_id, index)
    .then((result) => {
      if (result && result.status === 200) {
        const parseResponse = parseJSON(result.data);
        const newLot = setImageOnLotWithRequestID(
          currentPickupLot,
          parseResponse.request_id,
          element,
        );
        dispatch(setImageInCache(newLot, files[index].filename, parseResponse.request_id));
        return uploadImages(files, newLot, data, dispatch, getState, index + 1);
      }
      // console.log('Upload Failed', { result });
      return Promise.reject({ result });
    })
    .catch((err) => {
      console.log('Image upload encountered an error...', err);
      return Promise.reject(err);
    });
};

function parseJSON(param) {
  try {
    return JSON.parse(param);
  } catch (ex) {
    return param;
  }
}

const setImageOnLotWithRequestID = (lot, reqID, element) => {
  const newLot = { ...lot };
  const newObject = element.value;
  if (element.type === 'image') {
    newObject.requestId = reqID;
    newLot[newObject.key1] = newObject;
  } else {
    const a = newObject.filter(x => x.image.pathName.replace('file://', '') === element.filepath);
    a[0].image.requestId = reqID;
    newLot[newObject.key1] = newObject;
  }
  return newLot;
};
