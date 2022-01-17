export interface OfflineTranscribeJob {
	form: FormData,
}

export interface OfflineTranscribeJobResponse {
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

export interface TranscribedText {
	line: number,
	startTime: number,
	endTime: number,
	text: string
}

export interface TranscribedTextResponse {
	transcribedText: Array<TranscribedText>
}