import { AxiosResponse } from 'axios';
import moment from 'moment';
import { Dispatch } from "redux";
import { getOneUserSpeechHistory } from '../../api/batch-transcribe-api';
import { OneUserTranscriptionHistoryResponse } from '../../models/transcribe-history-response.model';
import { MgtTranscriptHistoriesAction } from '../actions-types/transcript-history-actions.types';
import { store } from "../store";
import { UserTranscriptionTypes } from '../types';
import { getOneTranscriptInJson } from './../../api/batch-transcribe-api';
import { TranscribedTextResponse } from './../../models/offline-transcribe-job.model';
import { TranscriptionHistory } from './../../models/transcribe-history-response.model';



export const getLoggedInUserTranscriptionHistory = () => {
	return async (dispatch: Dispatch) => {
		console.log("[DEBUG] getting transcripting history....");
		const { email } = store.getState().authReducer;

		await getOneUserSpeechHistory(email).then(
			(res: AxiosResponse<any>) => {
				let transcriptionHistory: OneUserTranscriptionHistoryResponse = res.data;
				transcriptionHistory.history = transcriptionHistory.history.map((h) => {
					// map a new property out called "title" for displaying in View-All-Jobs and View-One-Job
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
				};
				dispatch(action);

				return Promise.resolve();

			}).catch((error) => {
				console.error("[ERROR] Unable to get user transcription history");
				console.error(error);
				return Promise.reject();
			});
	};
};

export const setSelectedTranscriptionHistory = (selectedTranscriptHistory: TranscriptionHistory) => {
	return (dispatch: Dispatch) => {
		let action: MgtTranscriptHistoriesAction = {
			type: UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_HISTORY,
			selectedTranscriptHistory
		};

		dispatch(action);
	};
};


export const getSelectedTranscriptionText = (selectedTranscriptionId: string) => {
	return async (dispatch: Dispatch) => {
		await getOneTranscriptInJson(selectedTranscriptionId).then(
			(res: AxiosResponse<TranscribedTextResponse>) => {
				let postProcTranscribedText = res.data.transcribedText.map(
					(v, i, a) => {
						// console.log(v);
						// console.log(moment(v.startTime, 'HH:mm:ss,SSS').diff(moment().startOf('day'), 'seconds'));
						// console.log(moment(v.startTime, 'HH:mm:ss,SSS').diff(moment().startOf('day'), 'millisecond'));
						// console.log(moment(v.startTime, 'HH:mm:ss,SSS').format('ss.SSSSS'));
						// console.log(moment.duration(v.startTime).asSeconds());
						v.startTime = Number(moment(v.startTime, 'HH:mm:ss,SSS').format('ss.SSSSS'));
						v.endTime = Number(moment(v.endTime, 'HH:mm:ss,SSS').format('ss.SSSSS'));
						return v;
					});

				let action: MgtTranscriptHistoriesAction = {
					type: UserTranscriptionTypes.SET_SELECTED_TRANSCRIPTION_TEXT,
					selectedTranscriptionText: postProcTranscribedText
				};

				dispatch(action);
			}
		);
	};

};