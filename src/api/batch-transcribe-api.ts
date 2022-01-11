import { speechGatewayApi } from './api';
//import { OfflineTranscribeJob } from '../models/OfflineTranscribeJob.model';


export const getOneUserSpeechHistory = (email: string) => {
	return speechGatewayApi.get(
		`/speech/history`,
		{
			data: {
				email
			}
		})
}


export const getOneAudioRecordingFileSrcUrl = (inputZeroFileId: string) => {  // refer to recording.input[0].file._id
	return speechGatewayApi.get(
		`/files/${inputZeroFileId}/download`
	);
}


export const getOneTranscriptResult = (batchTranscribeId: string) => {
	return speechGatewayApi.get(
		`/speech/${batchTranscribeId}/result`
	)
}

export const submitOneJob = (file: FormData) => {
	return speechGatewayApi.post(
		`/speech`,
		file,
		{
			headers:
			{
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: progressEvent => console.log(progressEvent.loaded)
		},
	)
}