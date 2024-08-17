import { FETCH_USER, UPDATE_USER } from '../actions/types';

interface UserState {
  userDetails: object | null;
  loading: boolean;
}

// Define the initial state
const initialState: UserState = {
  userDetails: null,
  loading: true,
};

// Define the user reducer
const userReducer = (
  state: UserState = initialState,
  action: { type: string; payload?: any },
): UserState => {
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
