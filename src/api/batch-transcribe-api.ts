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