import { combineReducers } from 'redux';
import userReducer from './userReduser';

// Combine reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
