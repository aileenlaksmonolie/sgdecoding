import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import transcriptionHistoryReducer from './transcription-history-reducer';

// Combine all reducers into single object
const reducers = combineReducers({
	authReducer,
	transcriptionHistoryReducer
})

export default reducers;

export type RootState = ReturnType<typeof reducers>