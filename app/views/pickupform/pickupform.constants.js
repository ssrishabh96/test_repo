import referenceCodes from 'utils/mappers/referenceCodes';

import StepOne from './pickupsteps/step1.view';
import StepTwo from './pickupsteps/step2.view';
import StepThree from './pickupsteps/step3.view';

import DelivStepOne from './deliverysteps/step1.view';
import DelivStepTwo from './deliverysteps/step2.view';

export const PICK_FORM_SET_CURRENT_LOT = 'PICK_FORM_SET_CURRENT_LOT';
export const PICK_FORM_CLEAR_CURRENT_LOT = 'PICK_FORM_CLEAR_CURRENT_LOT';

export const FORM_GOTO_STEP = 'FORM_GOTO_STEP';
export const PICK_FORM_STEP_INCREMENT = 'PICK_FORM_STEP_INCREMENT';
export const PICK_FORM_STEP_DECREMENT = 'PICK_FORM_STEP_DECREMENT';
export const PICK_FORM_RESET_STEP = 'PICK_FORM_RESET_STEP';
export const PICK_FORM_UPDATE_LOT_DATA = 'PICK_FORM_UPDATE_LOT_DATA';
export const PICK_FORM_UPDATE_WARNING = 'PICK_FORM_UPDATE_WARNING';
export const PICK_FORM_IMAGE_PREVIEW = 'PICK_FORM_IMAGE_PREVIEW';

export const PICK_FORM_SUBMITTING = 'PICK_FORM_SUBMITTING';
export const PICK_FORM_SUBMIT_STATUS = 'PICK_FORM_SUBMIT_STATUS';

export const PICK_FORM_SUBMIT_COMPLETE = 'PICK_FORM_SUBMIT_COMPLETE';

export const PICK_FORM_CACHE_LOT = 'PICK_FORM_CACHE_LOT';
export const PICK_FORM_REMOVE_FROM_CACHE = 'PICK_FORM_REMOVE_FROM_CACHE';
export const PICK_FORM_CACHE_IMAGE = 'PICK_FORM_CACHE_IMAGE';

export const PICKUP_STEPS = { 0: StepOne, 1: StepTwo, 2: StepThree, length: 3 };
export const DELIVERY_STEPS = { 0: DelivStepOne, 1: DelivStepTwo, length: 2 };

// export const lotIsAwaitingSync = lot =>
//   pathOr(false, ['pickUpForm', 'cache', lot.dispatch_assignment_detail_id, 'isAwaitingSync']);

export const initialState = {
  loading: false,
  isLoading: false,
  currentStep: 0,
  currentPickupLot: {},
  formData: [], // (new Map(): Map<number, boolean>),
  steps: PICKUP_STEPS,
  referenceCodes,
  showImagePreview: false,
  // imagePreviewPath: '',
  imagePreview: {},

  isSubmitting: false, // boolean isSubmitting
  submittingStatus: '',
  cache: {
    // vendor_id:{
    //   assignmentDetailId: {
    //     lot: LOT,
    //      images: {
    //        filename: reqID,
    //      },
    //      isAwaitingSync: true/false,
    //   },
    // },
  },
};
