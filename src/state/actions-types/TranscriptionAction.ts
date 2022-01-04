import { TranscriptionHistory } from './../../models/transcribe-history-response.model';
import { UserTranscriptionTypes } from './../types/index';

interface GetUserAllTranscriptionHistoryAction{
	type: UserTranscriptionTypes.SET_THIS_USER_HISTORY,
	history: TranscriptionHistory[],
	totalHistory: number
}

export type UserTranscriptionAction = GetUserAllTranscriptionHistoryAction;