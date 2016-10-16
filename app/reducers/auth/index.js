import { fromJS } from 'immutable';

const AUTH_SIGN_IN = 'AUTH_SIGN_IN';

const AUTH_SIGN_IN_SENDING = 'AUTH_SIGN_IN_SENDING';
const AUTH_SIGN_IN_SUCCESS = 'AUTH_SIGN_IN_SUCCESS';
const AUTH_SIGN_IN_FAILURE = 'AUTH_SIGN_IN_FAILURE';

const AUTH_SIGN_OUT_SENDING = 'AUTH_SIGN_OUT_SENDING';
const AUTH_SIGN_OUT_SUCCESS = 'AUTH_SIGN_OUT_SUCCESS';
const AUTH_SIGN_OUT_FAILURE = 'AUTH_SIGN_OUT_FAILURE';

const firebase = window.firebase;

function initAuthRequest(dispatch) {
  return () => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      dispatch({
        type: AUTH_SIGN_IN,
        result: { user: firebaseUser },
      });
    });
  };
}

function signInAuthRequest(dispatch) {
  return () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const action = {
      types: [AUTH_SIGN_IN_SENDING, AUTH_SIGN_IN_SUCCESS, AUTH_SIGN_IN_FAILURE],
      promise: firebase.auth().signInWithPopup(provider),
    };
    dispatch(action);
  };
}

function signOutAuthRequest(dispatch) {
  return () => {
    const action = {
      types: [AUTH_SIGN_OUT_SENDING, AUTH_SIGN_OUT_SUCCESS, AUTH_SIGN_OUT_FAILURE],
      promise: firebase.auth().signOut(),
    };
    dispatch(action);
  };
}

export const actions = {
  initAuthRequest,
  signInAuthRequest,
  signOutAuthRequest,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SIGN_IN:
      return {
        ...state,
        user: action.result.user,
      };
    case AUTH_SIGN_IN_SENDING:
      return {
        ...state,
      };
    case AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        user: action.result.user,
      };
    case AUTH_SIGN_IN_FAILURE:
      return {
        ...state,
        signIn: {
          sending: false,
          error: 'error',
        },
      };
    case AUTH_SIGN_OUT_SENDING:
      return {
        ...state,
      };
    case AUTH_SIGN_OUT_SUCCESS:
      return {
        ...state,
        user: undefined,
      };
    case AUTH_SIGN_OUT_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
}

const initialState = fromJS({
  user: undefined,
  signIn: {
    error: '',
    sending: false,
  },
});

export default authReducer;
