import configureStore from 'redux-mock-store';
import { runSaga } from 'redux-saga';
import request from 'utils/request';
import { editProfile } from '../saga';

jest.mock('utils/request');

const data = { payload: 'submitForm', data: { registrationType: 'individual' } };
const selectRouter = { location: 'test' };
const initialState = {
  get: key => initialState[key],
  router: {
    get: key => selectRouter[key],
  },
  signupForm: {
    email: 'developer@mailinator.com',
    password: '8776f108e247ab1e2b323042c049c266407c81fbad41bde1e8dfc1bb66fd267e',
  },
};

const mockStore = configureStore();
const store = mockStore(initialState);
export async function recordSaga(saga) {
  const dispatched = [];
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState() {
        return store.getState();
      },
    },
    saga,
    data,
  ).done;

  return dispatched;
}

// editProfile
const dataVerifyCode = { payload: 'editProfile', data: { countryCode: {}, phoneNumber: '' } };
const verifyInitialState = {
  get: key => verifyInitialState[key],
  router: {
    get: key => selectRouter[key],
  },
  email: '',
  password: '',
};

const verifyStore = mockStore(verifyInitialState);

export async function verifyRecordSaga(saga) {
  const dispatched = [];
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
      getState() {
        return verifyStore.getState();
      },
    },
    saga,
    dataVerifyCode,
  ).done;

  return dispatched;
}

describe('Testing editProfile form', () => {
  test('Request With Status One', async () => {
    request.mockImplementation(() => Promise.resolve({ status: 1 }));
    await verifyRecordSaga(editProfile);
    expect(request).toHaveBeenCalled();
  });
  test('Request With Status One', async () => {
    dataVerifyCode.payload = 'submitForm';
    request.mockImplementation(() => Promise.resolve({ status: 1 }));
    await verifyRecordSaga(editProfile);
    expect(request).toHaveBeenCalled();
  });
  test('Request With Status Zero', async () => {
    dataVerifyCode.payload = 'test';
    request.mockImplementation(() => Promise.resolve({ status: 0 }));
    await verifyRecordSaga(editProfile);
    expect(request).toHaveBeenCalled();
  });
  test('Request With Network Error', async () => {
    request.mockImplementation(() => Promise.error({ status: 0 }));
    await verifyRecordSaga(editProfile);
    expect(request).toHaveBeenCalled();
  });
});
