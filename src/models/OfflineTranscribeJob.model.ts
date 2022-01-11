export interface OfflineTranscribeJob{
    form: FormData,
}

export interface OfflineTranscribeJobResponse{
	queue: string,
	result: object,
	status: string,
    formats: Array<String>,
	sampling: string,
	lang: string,
	name: string,
	_id: string,
    type: string,
    createdAt: string,
}