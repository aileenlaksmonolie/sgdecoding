import { MgtTranscriptHistoriesAction } from '../actions-types/transcript-history-actions.types';
import { UserTranscriptionTypes } from '../types/index';
import { TranscriptionHistory } from './../../models/transcribe-history-response.model';

interface TranscriptHistoryState{
	history: TranscriptionHistory[],
	totalHistory: number,
	selectedTranscriptHistory: TranscriptionHistory | undefined
}

export const INITIAL_STATE: TranscriptHistoryState = {
	history: [] as TranscriptionHistory[],
	totalHistory: 0,
	selectedTranscriptHistory: undefined
};

const reducer = (state = INITIAL_STATE, action: MgtTranscriptHistoriesAction) => {
	switch (action.type) {
		case UserTranscriptionTypes.SET_THIS_USER_HISTORY:
			const { history, totalHistory } = action;
			return {...state, history, totalHistory };

		case UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_HISTORY:
			const { selectedTranscriptHistory } = action;
			return { ...state, selectedTranscriptHistory};

		default:
			return state;
	}
};

export default reducer;