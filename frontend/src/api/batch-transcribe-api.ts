//import { OfflineTranscribeJob } from '../models/OfflineTranscribeJob.model';

import { proxyAPI } from "./api";


export const getOneUserSpeechHistory = (email: string) => {
	return proxyAPI.get(
		`/speech/history`,
		{
			data: {
				email
			}
		});
};


export const getOneAudioRecordingFileSrcUrl = (inputZeroFileId: string) => {  // refer to recording.input[0].file._id
	return proxyAPI.get(
		`/files/${inputZeroFileId}/download`
	);
};


export const downloadOneTranscriptionZipped = (batchTranscribeId: string) => {
	return proxyAPI.get(
		`/speech/${batchTranscribeId}/result`
	);
};

export const getOneTranscriptInJson = (batchTranscribeId: string) => {
	return proxyAPI.get(
		`/speech/${batchTranscribeId}/result/tojson`
	);
};

export const submitOneJob = (file: FormData) => {
	return proxyAPI.post(
		`/speech`,
		file,
		{
			headers:
			{
				'Content-Type': 'multipart/form-data',
			},
			//onUploadProgress: progressEvent => console.log(Math.round( (progressEvent.loaded * 100) / progressEvent.total)),
		},
	);
};
