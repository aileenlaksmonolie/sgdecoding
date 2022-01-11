import { AxiosResponse } from 'axios';
import moment from 'moment';
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
				transcriptionHistory.history = transcriptionHistory.history.map((h) => {
					let title = h.type === 'live' ? "Live Transcribe on " : "File Upload on ";
					title += moment(h.createdAt).format("ddd D MMM YYYY, h:mma");
					title += h.input[0].errorCode !== null ? ` (${h.input[0].errorCode})` : '';
					h.title = title;
					return h;
				});
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
	return (dispatch: Dispatch) => {
		let action: MgtTranscriptHistoriesAction = {
			type: UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_HISTORY,
			selectedTranscriptHistory
		}

		dispatch(action);
	}
}