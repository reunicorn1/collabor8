import { FETCH_USER, UPDATE_USER } from '../actions/types';

const initialState = {
  userDetails: null,
  loading: true,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER:
      return {
        ...state,
        userDetails: action.payload,
        loading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        userDetails: { ...state.userDetails, ...action.payload },
      };
    default:
      return state;
  }
};

export default userReducer;
