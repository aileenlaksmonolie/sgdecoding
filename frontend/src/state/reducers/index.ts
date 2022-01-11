import { combineReducers } from "redux";
import authReducer from './AuthReducer';
import testReducer from './TestReducer';
import transcriptionHistoryReducer from './transcription-history-reducer';

// Combine all reducers into single object
const reducers = combineReducers({
	test: testReducer,
	authReducer,
	transcriptionHistoryReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>