import { speechGatewayApi } from './api';


export const getOneUserSpeechHistory = (email: string) => {
	return speechGatewayApi.get(
		`/speech/history`,
		{
			data: {
				email
			}
		})
}