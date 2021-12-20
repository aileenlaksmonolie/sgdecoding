import axios from "axios";

export const speechGatewayApi = axios.create({
	baseURL: process.env.REACT_APP_SPEECH_GATEWAY
}) 

export const liveDecodeSocket = (accessToken: string) => { 
	return new WebSocket(`wss://gateway.speechlab.sg/client/ws/speech?` +
											`accessToken=${accessToken}` + 
											`&model=eng_telephony`
											+ `&content-type=audio/x-wav`
											+ `&layout=interleaved` 
											+ `&rate=48000` 
											+ `&format=S16LE` 
											+ `&channels=1`
)}