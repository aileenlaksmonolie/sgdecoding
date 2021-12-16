import { combineReducers } from "redux";
import authReducer from './AuthReducer';
import testReducer from './TestReducer';

// Combine all reducers into single object
const reducers = combineReducers({
	test: testReducer,
	authReducer: authReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>