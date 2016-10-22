import { fromJS } from 'immutable';

const ADD_PLACE_SENDING = 'ADD_PLACE_SENDING';
const ADD_PLACE_SUCCESS = 'ADD_PLACE_SUCCESS';
const ADD_PLACE_FAILURE = 'ADD_PLACE_FAILURE';

const DELETE_PLACE_SENDING = 'DELETE_PLACE_SENDING';
const DELETE_PLACE_SUCCESS = 'DELETE_PLACE_SUCCESS';
const DELETE_PLACE_FAILURE = 'DELETE_PLACE_FAILURE';

const GET_PLACES_SENDING = 'GET_PLACES_SENDING';
const GET_PLACES_SUCCESS = 'GET_PLACES_SUCCESS';
const GET_PLACES_FAILURE = 'GET_PLACES_FAILURE';

const firebase = window.firebase;

const getUserId = () => {
  let uid = 'noUserId';
  const user = firebase.auth().currentUser;
  if (user) { uid = user.uid; }
  return uid;
};

function addPlaceRequest(dispatch) {
  return (place) => {
    const updates = {
      [`/users/${getUserId()}/restaurants/${place.placeId}`]: { place },
    };
    const action = {
      types: [ADD_PLACE_SENDING, ADD_PLACE_SUCCESS, ADD_PLACE_FAILURE],
      promise: firebase.database().ref().update(updates),
    };
    dispatch(action);
  };
}

function deletePlaceRequest(dispatch) {
  return (placeId) => {
    const action = {
      types: [DELETE_PLACE_SENDING, DELETE_PLACE_SUCCESS, DELETE_PLACE_FAILURE],
      promise: firebase.database().ref(`/users/${getUserId()}/restaurants/${placeId}`).remove(),
    };
    dispatch(action);
  };
}

function getPlacesRequest(dispatch) {
  return () => {
    const action = {
      types: [GET_PLACES_SENDING, GET_PLACES_SUCCESS, GET_PLACES_FAILURE],
      promise: firebase.database().ref(`/users/${getUserId()}/restaurants/`).once('value'),
    };
    dispatch(action);
  };
}

export const actions = {
  addPlaceRequest,
  deletePlaceRequest,
  getPlacesRequest,
};

function placesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_PLACE_SENDING:
      return {
        ...state,
        addPlace: {
          error: '',
          sending: true,
        },
      };
    case ADD_PLACE_SUCCESS:
      return {
        ...state,
        addPlace: {
          error: '',
          sending: false,
        },
      };
    case ADD_PLACE_FAILURE:
      return {
        ...state,
        addPlace: {
          error: 'error',
          sending: false,
        },
      };
    case DELETE_PLACE_SENDING:
      return {
        ...state,
        deletePlace: {
          error: '',
          sending: true,
        },
      };
    case DELETE_PLACE_SUCCESS:
      return {
        ...state,
        deletePlace: {
          error: '',
          sending: false,
        },
      };
    case DELETE_PLACE_FAILURE:
      return {
        ...state,
        deletePlace: {
          error: 'error',
          sending: false,
        },
      };
    case GET_PLACES_SENDING:
      return {
        ...state,
        getPlaces: {
          ...state.getPlaces,
          error: '',
          sending: true,
        },
      };
    case GET_PLACES_SUCCESS:
      return {
        ...state,
        getPlaces: {
          error: '',
          data: action.result.val(),
          sending: false,
        },
      };
    case GET_PLACES_FAILURE:
      return {
        ...state,
        getPlaces: {
          error: 'error',
          data: [],
          sending: false,
        },
      };
    default:
      return state;
  }
}

const initialState = fromJS({
  addPlace: {
    error: '',
    sending: false,
  },
  deletePlace: {
    error: '',
    sending: false,
  },
  getPlaces: {
    error: '',
    sending: false,
    data: [],
  },
});

export default placesReducer;
