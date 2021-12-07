import { combineReducers } from "redux";
import testReducer from './testReducer';

// Combine all reducers into single object
const reducers = combineReducers({
	test: testReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>