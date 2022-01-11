import { TranscriptionHistory } from '../../models/transcribe-history-response.model';
import { UserTranscriptionTypes } from '../types/index';

interface GetAllTranscriptHistoriesAction{
	type: UserTranscriptionTypes.SET_THIS_USER_HISTORY,
	history: TranscriptionHistory[],
	totalHistory: number
}

interface SetSelectedTranscriptionHistoryAction{
	type: UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_HISTORY,
	selectedTranscriptHistory: TranscriptionHistory
}

export type MgtTranscriptHistoriesAction = GetAllTranscriptHistoriesAction | SetSelectedTranscriptionHistoryAction;