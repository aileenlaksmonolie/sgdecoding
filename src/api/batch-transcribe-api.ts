import { speechGatewayApi } from './api';
import { OfflineTranscribeJob } from '../models/OfflineTranscribeJob.model';


export const getOneUserSpeechHistory = (email: string) => {
	return speechGatewayApi.get(
		`/speech/history`,
		{
			data: {
				email
			}
		})
}

export const submitOneJob = (formData: FormData) => {
	return speechGatewayApi.post(
		`/speech`,
		/* { token: newJob.token, file: newJob.file, name: newJob.name, size: newJob.size, lang: newJob.lang,
		audioType: newJob.audioType, audioTrack: newJob.audioTrack}, */
		formData,
		{
			headers:
			{
				'Content-Type': 'multipart/form-data',
			}
		},
	)
}