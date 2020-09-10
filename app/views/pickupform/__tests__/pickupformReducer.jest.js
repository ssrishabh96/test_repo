import { configureReduxStore } from 'utils/test/testSetup';
import { initialState } from '../pickupform.constants';

import { pickUpFormReducer } from '../pickupform.redux';
import * as actions from '../pickupform.action';
import { removeLotInfoFromCache } from 'views/lotview/lotview.action';
import { uploadImage, postPickupForm } from '../pickupform.service';

import StepOne from '../pickupsteps/step1.view';
import StepTwo from '../pickupsteps/step2.view';
import StepThree from '../pickupsteps/step3.view';
import delivStepOne from '../deliverysteps/step1.view';
import delivStepTwo from '../deliverysteps/step2.view';

const navigator = {
  showInAppNotification: jest.fn(),
};
// const store = configureReduxStore(initialState);
uploadImage.mockImplementation(() =>
  Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
);
postPickupForm.mockImplementation(() =>
  Promise.resolve({ status: 200, data: { status: 'success' } }),
);
jest.mock('../pickupform.service', () => ({
  uploadImage: jest.fn(),
  postPickupForm: jest.fn(),
}));

const initialMockLot = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
};
const formReadyLot = {
  dispatch_assignment_detail_id: 42,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleDescCorrection: 'Blue Honda',
  yardAddress: '',
  pickUpAddress: '123 plano TX 75075',
};
const submitReadyLot = {
  dispatch_assignment_detail_id: '42',
  uploadAttachment: [
    { image: { pathName: 'file://path/to/image\\filename1' }, documentType: 'photo' },
  ],
  number: 12345,
  yardNumber: 68,
  tripType: 'P',
  formType: 'P',
  source: { line_1: 123, city: 'plano', state: 'TX', zip: 75075 },
  destination: { line_1: null, city: null, state: null, zip: null },
  description: 'Blue Honda',
  vehicleDescCorrection: 'Blue Honda',
  yardAddress: '',
  pickUpAddress: '123 plano TX 75075',
  driverSignature: { encoded: '000' },
  ownerSignature: { encoded: '000' },
};

describe('Pickup Form Reducer', () => {
  describe('calling set current pickup lot', () => {
    test('updates the currentpickuplot in the store', () => {
      const currentPickupLot = { ...initialMockLot };
      const transformedLot = { ...formReadyLot };
      const store = configureReduxStore(initialState);
      expect(
        pickUpFormReducer(
          { ...initialState },
          store.dispatch(actions.setCurrentPickupLot(currentPickupLot)),
        ),
      ).toEqual({ ...initialState, currentPickupLot: transformedLot });
    });
    test('will get the cached lot', () => {
      const store = configureReduxStore({
        pickUpForm: { cache: { 1: { 42: { lot: formReadyLot } } } },
        login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
      });
      store.dispatch(actions.setCurrentPickupLot({ dispatch_assignment_detail_id: 42 }));
      expect(store.getActions()).toEqual([
        { type: 'PICK_FORM_SET_CURRENT_LOT', currentPickupLot: formReadyLot },
      ]);
    });
  });
  test('calling clearCurrentPickupLot clears the lot from the store', () => {
    const currentPickupLot = { ...initialMockLot };
    const state = pickUpFormReducer(
      { ...initialState },
      actions.setCurrentPickupLot(currentPickupLot),
    );
    expect(pickUpFormReducer(state, actions.clearCurrentPickupLot())).toEqual(initialState);
  });
  test('calling show image preview updates the store', () => {
    const showImagePreview = true;
    const imagePreview = 'imagePreview';
    expect(
      pickUpFormReducer(initialState, actions.showHideImagePreview(showImagePreview, imagePreview)),
    ).toEqual({ ...initialState, showImagePreview, imagePreview });
  });
  test('calling cacheCurrentForm saves the form data in the store', () => {
    const action = {
      type: 'PICK_FORM_CACHE_LOT',
      id: 42,
      userId: 1,
      lot: formReadyLot,
      isAwaitingSync: false,
    };
    const store = configureReduxStore({
      login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
    });
    store.dispatch(actions.cacheCurrentForm(formReadyLot, false));
    expect(store.getActions()).toEqual([action]);

    const state = pickUpFormReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      cache: { 1: { 42: { lot: formReadyLot, isAwaitingSync: false } } },
    });

    const action2 = {
      type: 'PICK_FORM_CACHE_LOT',
      id: 42,
      userId: 1,
      lot: formReadyLot,
      isAwaitingSync: true,
    };
    const store2 = configureReduxStore({
      login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
    });
    store2.dispatch(actions.cacheCurrentForm(formReadyLot, true));
    expect(store2.getActions()).toEqual([action2]);

    const state2 = pickUpFormReducer(initialState, action2);
    expect(state2).toEqual({
      ...initialState,
      cache: { 1: { 42: { lot: formReadyLot, isAwaitingSync: true } } },
    });
  });
  test('calling removeFormFromCache removes the cached form data for that lot', () => {
    const action = {
      type: 'PICK_FORM_REMOVE_FROM_CACHE',
      id: 42,
      userId: 1,
    };
    const store = configureReduxStore({
      login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
    });
    store.dispatch(actions.removeFormFromCache(formReadyLot));
    expect(store.getActions()).toEqual([action]);

    const state = { ...initialState, cache: { 1: { 42: { lot: formReadyLot } } } };
    const newstate = pickUpFormReducer(state, action);
    expect(newstate).toEqual({
      ...initialState,
      cache: { 1: {} },
    });
  });
  test('cacheing an image saves the reqid in the store', () => {
    const action = {
      type: 'PICK_FORM_CACHE_IMAGE',
      id: 42,
      userId: 1,
      fileName: 'filename',
      reqId: 22,
    };
    const store = configureReduxStore({
      login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
    });
    store.dispatch(actions.setImageInCache(formReadyLot, 'filename', 22));
    expect(store.getActions()).toEqual([action]);

    const state = pickUpFormReducer(initialState, action);
    expect(state).toEqual({ ...initialState, cache: { 1: { 42: { images: { filename: 22 } } } } });
  });
  describe('Incrementing the current step', () => {
    test('should change the currentStep if step is less than 2', () => {
      expect(
        pickUpFormReducer({ ...initialState, currentStep: 0 }, actions.incrementCurrentStep()),
      ).toEqual({
        ...initialState,
        currentStep: 1,
      });
    });
    test('should not change the currentStep if step is equal to 2', () => {
      expect(
        pickUpFormReducer({ ...initialState, currentStep: 2 }, actions.incrementCurrentStep()),
      ).toEqual({
        ...initialState,
        currentStep: 2,
      });
    });
  });
  describe('Decrementing the current step', () => {
    test('should decrease current step if it is greater than 0', () => {
      expect(
        pickUpFormReducer({ ...initialState, currentStep: 1 }, actions.decrementCurrentStep()),
      ).toEqual({
        ...initialState,
        currentStep: 0,
      });
    });
    test('should not decrease current step if it is greater than 0', () => {
      const state = { ...initialState, currentStep: 0 };
      expect(
        pickUpFormReducer({ ...initialState, currentStep: 0 }, actions.decrementCurrentStep()),
      ).toEqual({
        ...initialState,
        currentStep: 0,
      });
    });
  });
  describe('Updating the lot data', () => {
    let state;
    beforeEach(() => {
      state = {
        currentStep: 0,
        steps: {
          0: {
            vehicleDetails: [{ key1: 'itemOne', value: 'red' }, { key1: 'itemTwo', value: '' }],
          },
        },
        currentPickupLot: {
          itemOne: 'red',
        },
      };
    });
    test('should update both the step object and the currentPickupLot', () => {
      const key = 'itemOne';
      const value = 'foobar';
      const action = actions.updatePickupLotData(key, value);
      expect(pickUpFormReducer(state, action)).toEqual({
        currentStep: 0,
        steps: {
          0: {
            vehicleDetails: [{ key1: 'itemOne', value: 'foobar' }, { key1: 'itemTwo', value: '' }],
          },
        },
        currentPickupLot: {
          itemOne: 'foobar',
        },
      }); // expect
    }); // test
    test('should add new values to currentPickupLot', () => {
      const key = 'itemTwo';
      const value = 'foobar';
      const action = actions.updatePickupLotData(key, value);
      expect(pickUpFormReducer(state, action)).toEqual({
        currentStep: 0,
        steps: {
          0: {
            vehicleDetails: [
              { key1: 'itemOne', value: 'red' },
              { key1: 'itemTwo', value: 'foobar' },
            ],
          },
        },
        currentPickupLot: {
          itemOne: 'red',
          itemTwo: 'foobar',
        },
      }); // expect
    }); // test
  });
  describe('Updating Warning Flags', () => {
    let state;
    beforeEach(() => {
      state = {
        currentStep: 0,
        steps: {
          0: {
            vehicleDetails: [
              { key1: 'itemOne', showWarning: false },
              { key1: 'itemTwo', showWarning: false },
              { key1: 'itemThree', showWarning: false },
            ],
          },
        },
      }; // state
    });
    test('Should change the showWarning flag for each given key', () => {
      const items = [{ key1: 'itemOne' }, { key1: 'itemTwo' }];
      const value = true;
      const action = actions.updateWarningFlags(items, value);
      expect(pickUpFormReducer(state, action)).toEqual({
        currentStep: 0,
        steps: {
          0: {
            vehicleDetails: [
              { key1: 'itemOne', showWarning: true },
              { key1: 'itemTwo', showWarning: true },
              { key1: 'itemThree', showWarning: false },
            ],
          },
        },
      });
    });
  });
  describe('calling setCurrentPickupLot with a new lot', () => {
    let state;
    let store;
    beforeEach(() => {
      store = configureReduxStore(initialState);
      state = initialState;
      // some actions to mutate the state
      state = pickUpFormReducer(state, store.dispatch(actions.setCurrentPickupLot(initialMockLot)));
      state = pickUpFormReducer(state, actions.updatePickupLotData('poa', 'Yes'));
      state = pickUpFormReducer(state, actions.updatePickupLotData('colors', 'RED'));
      state = pickUpFormReducer(state, actions.updatePickupLotData('state', 'TX'));
      state = pickUpFormReducer(
        state,
        actions.updateWarningFlags([{ key1: 'licensePlate' }], 'true'),
      );
    });
    test('resets steps to their initial pickup value', () => {
      const currentPickupLot = { ...initialMockLot, dispatch_assignment_detail_id: 11 };
      const action = store.dispatch(actions.setCurrentPickupLot(currentPickupLot));
      expect(pickUpFormReducer(state, action).steps).toEqual({
        0: StepOne,
        1: StepTwo,
        2: StepThree,
        length: 3,
      });
    });
    test('resets steps to their initial delivery value', () => {
      const currentPickupLot = {
        ...initialMockLot,
        dispatch_assignment_detail_id: 11,
        tripType: 'D',
        formType: 'D',
      };
      const action = store.dispatch(actions.setCurrentPickupLot(currentPickupLot));
      expect(pickUpFormReducer(state, action).steps).toEqual({
        0: delivStepOne,
        1: delivStepTwo,
        length: 2,
      });
    });
  });
  describe('submitting the pickupform', () => {
    let state;
    let currentPickupLot;
    let store;
    test('will not upload an image if it\'s request id is already in cache', () => {
      store = configureReduxStore({
        login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
        pickUpForm: { cache: { 1: { 42: { images: { filename1: 111 } } } } },
      });
      return store
        .dispatch(actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }))
        .then(() => {
          expect(uploadImage.mock.calls.length).toEqual(0);
        });
    });
    beforeEach(() => {
      currentPickupLot = { ...submitReadyLot };
      state = {
        ...initialState,
        currentPickupLot,
      };
      store = configureReduxStore({
        login: { user: { profiles: { activeProfile: { vendor: { vendor_id: 1 } } } } },
        pickUpForm: state,
      });
    });
    test('calls upload image for each image file', () => {
      currentPickupLot = {
        ...submitReadyLot,
        uploadAttachment: [
          {
            image: { pathName: 'file://path/to/image\\filename1' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
          {
            image: { pathName: 'file://path/to/image\\filename2' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
          {
            image: { pathName: 'file://path/to/image\\filename3' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
        ],
        attachment: [
          {
            image: { pathName: 'file://path/to/image\\filename4' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
          {
            image: { pathName: 'file://path/to/image\\filename5' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
        ],
        creditCardImage: [
          {
            image: { pathName: 'file://path/to/image\\filename6' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
        ],
        checkImage: [
          {
            image: { pathName: 'file://path/to/image\\filename7' },
            documentType: 'ADVANCE_CHARGE_RECEIPT',
          },
        ],
        vehicleImages: {
          pathName: 'file://path/to/image\\filename8',
          type: 'image',
          documentType: 'DISPATCH_IMAGE',
        },
      };
      return store
        .dispatch(actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }))
        .then(() => {
          expect(uploadImage.mock.calls.length).toEqual(8);
        });
    });
    describe('successfully', () => {
      test('uploadPickupForm resolves', () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        expect.assertions(1);
        return expect(
          store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          ),
        ).resolves.toBeUndefined();
      });
      test('dispatches the correct actions', () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        const expectedActions = [
          actions.setFormSubmitting('Preparing form for upload.'),
          actions.setFormSubmittingStatus(`Uploading image... ${1} of ${1}`),
          // actions.setImageInCache(currentPickupLot, 'filename1', 1),
          { type: 'PICK_FORM_CACHE_IMAGE', fileName: 'filename1', reqId: 1, userId: 1, id: '42' },
          actions.setFormSubmittingStatus('Image upload complete.'),
          actions.setFormSubmittingStatus('Uploading Form'),
          actions.setFormSubmittingStatus('Upload Complete.'),

          { bucket: 'inProgress', lots: [], type: 'LOTLIST_LOADED' },
          actions.resetCurrentStep(),
          removeLotInfoFromCache(currentPickupLot.dispatch_assignment_detail_id),
          // actions.removeFormFromCache(currentPickupLot),
          { type: 'PICK_FORM_REMOVE_FROM_CACHE', id: '42', userId: 1 },

          // actions.setFormSubmittingComplete(), // this should also be called but jest times out before it does because its in a setTimeout
        ];
        return store
          .dispatch(actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }))
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
      test('removes the lot from cache', () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        return store
          .dispatch(actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }))
          .then(() => {
            expect(store.getActions()).toContainEqual(
              // actions.removeFormFromCache(currentPickupLot),
              { type: 'PICK_FORM_REMOVE_FROM_CACHE', id: '42', userId: 1 },
            );
          });
      });
    });
    describe('but image upload is unsuccessful', () => {
      test('uploadPickupForm() rejects with the correct error', () => {
        uploadImage.mockImplementation(() => Promise.reject({ error: 'unsupported type' }));
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        expect.assertions(1);
        return expect(
          store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          ),
        ).rejects.toEqual({ error: 'unsupported type' });
      });
      test('dispatches the correct actions', async () => {
        uploadImage.mockImplementation(() => Promise.reject({ error: 'unsupported type' }));
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        const expectedActions = [
          actions.setFormSubmitting('Preparing form for upload.'),
          actions.setFormSubmittingStatus(`Uploading image... ${1} of ${1}`),
          actions.setFormSubmittingComplete(),
          // actions.cacheCurrentForm(currentPickupLot, true),
          {
            type: 'PICK_FORM_CACHE_LOT',
            id: '42',
            userId: 1,
            lot: currentPickupLot,
            isAwaitingSync: true,
          },
        ];
        expect.assertions(1);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
        } finally {
          expect(store.getActions()).toEqual(expectedActions);
        }
      });
      test('saves the form in cache', async () => {
        uploadImage.mockImplementation(() => Promise.reject({ error: 'unsupported type' }));
        postPickupForm.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { status: 'success' } }),
        );
        expect.assertions(2);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
          expect(e).toEqual({ error: 'unsupported type' });
        } finally {
          expect(store.getActions()).toContainEqual(
            // actions.cacheCurrentForm(currentPickupLot, true),
            {
              type: 'PICK_FORM_CACHE_LOT',
              id: '42',
              userId: 1,
              lot: currentPickupLot,
              isAwaitingSync: true,
            },
          );
        }
      });
    });
    describe('but service rejects the form upload', () => {
      test('uploadPickupForm() rejects with the correct error', () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() => Promise.reject({ error: 'request timed out' }));
        expect.assertions(1);
        return expect(
          store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          ),
        ).rejects.toEqual({ error: 'request timed out' });
      });
      test('dispatches the correct actions', async () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() => Promise.reject({ error: 'request timed out' }));
        const expectedActions = [
          actions.setFormSubmitting('Preparing form for upload.'),
          actions.setFormSubmittingStatus(`Uploading image... ${1} of ${1}`),
          // actions.setImageInCache(currentPickupLot, 'filename1', 1),
          { type: 'PICK_FORM_CACHE_IMAGE', fileName: 'filename1', reqId: 1, userId: 1, id: '42' },
          actions.setFormSubmittingStatus('Image upload complete.'),
          actions.setFormSubmittingStatus('Uploading Form'),
          actions.setFormSubmittingComplete(),
          // actions.cacheCurrentForm(currentPickupLot, true),
          {
            type: 'PICK_FORM_CACHE_LOT',
            id: '42',
            userId: 1,
            lot: currentPickupLot,
            isAwaitingSync: true,
          },
        ];
        expect.assertions(2);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
          expect(e).toEqual({ error: 'request timed out' });
        } finally {
          expect(store.getActions()).toEqual(expectedActions);
        }
      });
      test('saves the form in cache', async () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() => Promise.reject({ error: 'request timed out' }));
        expect.assertions(2);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
          expect(e).toEqual({ error: 'request timed out' });
        } finally {
          expect(store.getActions()).toContainEqual(
            // actions.cacheCurrentForm(currentPickupLot, true),
            {
              type: 'PICK_FORM_CACHE_LOT',
              id: '42',
              userId: 1,
              lot: currentPickupLot,
              isAwaitingSync: true,
            },
          );
        }
      });
    });
    describe('but form upload service returns status error', () => {
      test('uploadPickupForm() rejects with the correct error', () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({
            status: 200,
            data: { status: 'error', errors: [{ something: 'is required' }] },
          }),
        );
        expect.assertions(1);
        return expect(
          store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          ),
        ).rejects.toEqual({ status: 'error', errors: [{ something: 'is required' }] });
      });
      test('dispatches the correct actions', async () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({
            status: 200,
            data: { status: 'error', errors: [{ something: 'is required' }] },
          }),
        );
        const expectedActions = [
          actions.setFormSubmitting('Preparing form for upload.'),
          actions.setFormSubmittingStatus(`Uploading image... ${1} of ${1}`),
          // actions.setImageInCache(currentPickupLot, 'filename1', 1),
          { type: 'PICK_FORM_CACHE_IMAGE', fileName: 'filename1', reqId: 1, userId: 1, id: '42' },
          actions.setFormSubmittingStatus('Image upload complete.'),
          actions.setFormSubmittingStatus('Uploading Form'),
          actions.setFormSubmittingComplete(),
          // actions.cacheCurrentForm(currentPickupLot, true),
          {
            type: 'PICK_FORM_CACHE_LOT',
            id: '42',
            userId: 1,
            lot: currentPickupLot,
            isAwaitingSync: true,
          },
        ];
        expect.assertions(2);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
          expect(e).toEqual({ status: 'error', errors: [{ something: 'is required' }] });
        } finally {
          expect(store.getActions()).toEqual(expectedActions);
        }
      });
      test('saves the form in cache', async () => {
        uploadImage.mockImplementation(() =>
          Promise.resolve({ status: 200, data: JSON.stringify({ request_id: 1 }) }),
        );
        postPickupForm.mockImplementation(() =>
          Promise.resolve({
            status: 200,
            data: { status: 'error', errors: [{ something: 'is required' }] },
          }),
        );
        expect.assertions(2);
        try {
          await store.dispatch(
            actions.uploadPickupForm(currentPickupLot, { navigator, props: { navigator } }),
          );
        } catch (e) {
          expect(e).toEqual({ status: 'error', errors: [{ something: 'is required' }] });
        } finally {
          expect(store.getActions()).toContainEqual({
            type: 'PICK_FORM_CACHE_LOT',
            id: '42',
            userId: 1,
            lot: currentPickupLot,
            isAwaitingSync: true,
          });
        }
      });
    });
  });
  describe('syncFormSubmission', () => {
    test('should getLotCharges');
    test('should dispatch uploadPickupForm');
    test('should do something if it fails?');
    test.skip('should remove the lot from cache if it succeeds', () => {
      // TODO: need to mock getLotCharges...
      const store = configureReduxStore({
        pickUpForm: { cache: { 42: { lot: formReadyLot, isAwaitingSync: true } } },
      });
      return store
        .dispatch(actions.syncFormSubmission(formReadyLot, { navigator, props: { navigator } }))
        .then(() => {
          // expect(store.getActions()).toContainEqual(actions.removeFormFromCache(formReadyLot));
          expect(store.getActions()).toContainEqual({
            type: 'PICK_FORM_REMOVE_FROM_CACHE',
            id: '42',
            userId: 1,
          });
        });
    });
  });
});
