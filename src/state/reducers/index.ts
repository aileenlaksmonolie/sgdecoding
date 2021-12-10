import { combineReducers } from "redux";
import authReducer from "./authReducer";
import testReducer from './testReducer';


// Combine all reducers into single object
const reducers = combineReducers({
	test: testReducer,
	isLoggedIn: authReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>