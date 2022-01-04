import { OneUserTranscriptionHistory } from "../../models/transcribe-history-response.model";
import { UserTranscriptionAction } from '../actions-types/TranscriptionAction';
import { UserTranscriptionTypes } from '../types/index';

export const INITIAL_STATE: OneUserTranscriptionHistory = {
	history: [],
	totalHistory: 0
}

const reducer = (state = INITIAL_STATE, action: UserTranscriptionAction) => {
	switch (action.type) {
		case UserTranscriptionTypes.SET_THIS_USER_HISTORY:
			const { history, totalHistory } = action;
			return {...state, history, totalHistory };
		default:
			return state;
	}

}

export default reducer;