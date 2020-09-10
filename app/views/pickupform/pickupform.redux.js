import { pathOr, findIndex, propEq, assocPath, dissocPath } from 'ramda';
import { getActiveVendorId } from 'views/login/helpers/loginHelpers';
import { createStructuredSelector } from 'reselect';

import {
  initialState,
  PICK_FORM_SET_CURRENT_LOT,
  PICK_FORM_CLEAR_CURRENT_LOT,
  PICK_FORM_CACHE_LOT,
  PICK_FORM_CACHE_IMAGE,
  PICK_FORM_REMOVE_FROM_CACHE,
  FORM_GOTO_STEP,
  PICK_FORM_STEP_INCREMENT,
  PICK_FORM_STEP_DECREMENT,
  PICK_FORM_RESET_STEP,
  PICK_FORM_UPDATE_LOT_DATA,
  PICK_FORM_UPDATE_WARNING,
  PICK_FORM_IMAGE_PREVIEW,
  PICK_FORM_SUBMITTING,
  PICK_FORM_SUBMIT_STATUS,
  PICK_FORM_SUBMIT_COMPLETE,
} from './pickupform.constants';
import { getLotTripFormByType } from 'constants/tripTypeMap';

export const pickUpFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case PICK_FORM_SET_CURRENT_LOT:
      return {
        ...state,
        isLoading: false,
        currentPickupLot: action.currentPickupLot,
        steps: action.steps,
      };
    case PICK_FORM_CLEAR_CURRENT_LOT:
      return {
        ...state,
        currentPickupLot: initialState.currentPickupLot,
        steps: initialState.steps,
        currentStep: 0,
      };
    case PICK_FORM_CACHE_LOT:
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.userId.toString()]: {
            ...pathOr({}, ['cache', action.userId.toString()])(state),
            [action.id.toString()]: {
              ...pathOr({}, ['cache', action.userId.toString(), action.id.toString()])(state),
              lot: action.lot,
              isAwaitingSync: action.isAwaitingSync,
            },
          },
        },
      };
    case PICK_FORM_CACHE_IMAGE:
      return assocPath(
        ['cache', action.userId.toString(), action.id.toString(), 'images', action.fileName],
        action.reqId,
      )(state);
    case PICK_FORM_REMOVE_FROM_CACHE:
      return dissocPath(['cache', action.userId.toString(), action.id.toString()])(state);
    case FORM_GOTO_STEP:
      return {
        ...state,
        currentStep: action.step,
      };
    case PICK_FORM_STEP_INCREMENT:
      return {
        ...state,
        currentStep:
          state.currentStep === state.steps.length - 1
            ? state.steps.length - 1
            : state.currentStep + 1,
      };
    case PICK_FORM_STEP_DECREMENT:
      return {
        ...state,
        currentStep: state.currentStep === 0 ? 0 : state.currentStep - 1,
      };
    case PICK_FORM_RESET_STEP:
      return {
        ...state,
        currentStep: 0,
      };
    case PICK_FORM_UPDATE_LOT_DATA:
      return {
        ...state,
        currentPickupLot: {
          ...state.currentPickupLot,
          [action.key]: action.value,
        },
        steps: {
          ...state.steps,
          [state.currentStep]: updateStep(state.steps[state.currentStep], action),
        },
      };
    case PICK_FORM_UPDATE_WARNING:
      return {
        ...state,
        steps: {
          ...state.steps,
          [state.currentStep]: updateStepWarnings(state.steps[state.currentStep], action),
        },
      };
    case PICK_FORM_IMAGE_PREVIEW:
      return {
        ...state,
        showImagePreview: action.value,
        imagePreview: action.imagePreview,
      };
    case PICK_FORM_SUBMITTING:
      return {
        ...state,
        isSubmitting: true,
        submittingStatus: action.status,
      };
    case PICK_FORM_SUBMIT_STATUS:
      return {
        ...state,
        submittingStatus: action.status,
      };
    case PICK_FORM_SUBMIT_COMPLETE:
      return {
        ...state,
        isSubmitting: false,
        submittingStatus: '',
      };
    case 'persist/REHYDRATE': {
      return {
        ...initialState,
        cache: pathOr({}, ['payload', 'pickUpForm', 'cache'], action),
      };
    }
    default:
      return state;
  }
};

function updateStep(step, action) {
  const newStep = JSON.parse(JSON.stringify(step));
  newStep.vehicleDetails[findIndex(propEq('key1', action.key))(newStep.vehicleDetails)].value =
    action.value;
  return newStep;
}
function updateStepWarnings(step, action) {
  const newStep = JSON.parse(JSON.stringify(step));
  action.items.forEach((item) => {
    newStep.vehicleDetails[
      findIndex(propEq('key1', item.key1))(newStep.vehicleDetails)
    ].showWarning =
      action.value;
  });
  return newStep;
}
const incrementCurrentStep = pathOr(null, ['lotlist', 'trip']);
const decrementCurrentStep = pathOr(null, ['lotlist', 'trip']);
const setCurrentPickupLot = pathOr(null, ['lotlist', 'trip']);
const setCurrentItemValue = pathOr(false, ['lotlist', 'isLoading']);
const getSelectedStepForm = pathOr({}, ['lotlist', 'selectedLots']);
const getError = pathOr(null, ['lotlist', 'error']);

export const getCacheForCurrentUser = state =>
  pathOr({}, ['pickUpForm', 'cache', getActiveVendorId(state)])(state);

export const pickUpFormSelector = createStructuredSelector({
  incrementCurrentStep,
  decrementCurrentStep,
  setCurrentPickupLot,
  setCurrentItemValue,
  getSelectedStepForm,
  error: getError,
});
