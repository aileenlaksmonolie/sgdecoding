import { AxiosResponse } from 'axios';
import { Dispatch } from "redux";
import { UserTranscriptionAction } from '../actions-types/TranscriptionAction';
import { store } from "../Store";
import { UserTranscriptionTypes } from '../types';
import { getOneUserSpeechHistory } from './../../api/batch-transcribe-api';
import { OneUserTranscriptionHistory } from './../../models/transcribe-history-response.model';



export const getLoggedInUserTranscriptionHistory = () => {
	return async (dispatch: Dispatch) => {
		console.log("Dispatched!!")
		const { email } = store.getState().authReducer;

		await getOneUserSpeechHistory(email).then(
			(res: AxiosResponse<any>) => {
				let transcriptionHistory: OneUserTranscriptionHistory = res.data;
				let action: UserTranscriptionAction = {
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