import { AxiosResponse } from 'axios';
import { Dispatch } from "redux";
import { getOneUserSpeechHistory } from '../../api/batch-transcribe-api';
import { OneUserTranscriptionHistoryResponse } from '../../models/transcribe-history-response.model';
import { MgtTranscriptHistoriesAction } from '../actions-types/transcript-history-actions';
import { store } from "../Store";
import { UserTranscriptionTypes } from '../types';
import { TranscriptionHistory } from './../../models/transcribe-history-response.model';



export const getLoggedInUserTranscriptionHistory = () => {
	return async (dispatch: Dispatch) => {
		const { email } = store.getState().authReducer;

		await getOneUserSpeechHistory(email).then(
			(res: AxiosResponse<any>) => {
				let transcriptionHistory: OneUserTranscriptionHistoryResponse = res.data;
				let action: MgtTranscriptHistoriesAction = {
					type: UserTranscriptionTypes.SET_THIS_USER_HISTORY,
					history: transcriptionHistory.history,
					totalHistory: transcriptionHistory.totalHistory
				}
				dispatch(action);
				return Promise.resolve();
			}).catch((error) => {
				console.error("[ERROR] Unable to get user transcription history");
				console.error(error);
				return Promise.reject();
			});
	}
}

export const setSelectedTranscriptionHistory = (selectedTranscriptHistory: TranscriptionHistory) => {
	return (dispatch : Dispatch) => {
		let action: MgtTranscriptHistoriesAction = {
			type: UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_HISTORY,
			selectedTranscriptHistory
		}

		dispatch(action);
	}
}