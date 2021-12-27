import axios from "axios";

export const speechGatewayApi = axios.create({
	baseURL: process.env.REACT_APP_SPEECH_GATEWAY
}) 

export const liveDecodeSocket = (accessToken: string) => { 
	return new WebSocket(`wss://gateway.speechlab.sg/client/ws/speech?` +
		`content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1` +
		`&accessToken=${accessToken}` + 
		`&model=eng_telephony`
)}