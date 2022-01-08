export interface OfflineTranscribeJob{
    token: string,
	file: object,
	name: string,
	size: string,
	lang: string,
	audioType: string,
    audioTrack: string
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