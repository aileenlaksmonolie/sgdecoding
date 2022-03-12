import { combineReducers } from "redux";
import { AuthAction } from "../actions-types/auth-actions.types";
import { AuthTypes } from './../types/index';
import authReducer from "./auth-reducer";
import navbarReducer from "./navbar-reducer";
import transcriptionHistoryReducer from './transcription-history-reducer';

// Combine all reducers into single object
const reducers = combineReducers({
	authReducer,
	transcriptionHistoryReducer,
	navbarReducer	
});

const rootReducer = (state: any, action:AuthAction) => {
	if(action.type === AuthTypes.DELETE_TOKEN){
		localStorage.removeItem('authReducer');
		localStorage.removeItem('_persist');
		return reducers(undefined, action);
	}

	return reducers(state, action);
};

export default rootReducer;

export type RootState = ReturnType<typeof reducers>;