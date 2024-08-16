import { combineReducers } from 'redux';
import userReducer from './userReduser';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
