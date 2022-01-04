import axios from "axios";
import { store } from "../state";

const speechGatewayApi = axios.create({
	baseURL: process.env.REACT_APP_SPEECH_GATEWAY,
})

speechGatewayApi.interceptors.request.use(
	function(config){	
		const { token } = store.getState().authReducer;
		if(token){
			config.headers!['Authorization'] = `Bearer ${token}`
		}
		return config;
	},
	function(error){
		return Promise.reject(error);
	}
)


const liveDecodeSocket = (accessToken: string) => { 
	return new WebSocket(`wss://gateway.speechlab.sg/client/ws/speech?` +
		`content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1` +
		`&accessToken=${accessToken}` + 
		`&model=eng_telephony`
)}

export { speechGatewayApi, liveDecodeSocket };

