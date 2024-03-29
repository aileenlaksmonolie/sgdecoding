import axios from "axios";
import { store } from "../state";

const proxyAPI = axios.create({
	// baseURL: process.env.REACT_APP_API,
	// baseURL : (os.environ['REDIS_DB'])
	baseURL : "http://3.101.152.95:2000"
});

proxyAPI.interceptors.request.use(
	function(config){	
		const { token } = store.getState().authReducer;
		if(token){
			config.headers!['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	function(error){
		return Promise.reject(error);
	}
);

const liveDecodeSocket = (accessToken: string, langModel: string) => {

	// return new WebSocket(`${process.env.REACT_APP_LIVE_WSS}?` +
		return new WebSocket(`wss://gateway.speechlab.sg/client/ws/speech?` +
		`content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1` +
		`&accessToken=${accessToken}` + 
		`&model=${langModel}`);
	
	// return new WebSocket(`wss://gateway.speechlab.sg/client/ws/speech?` +
	// 	`content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1` +
	// 	`&accessToken=${accessToken}` + 
	// 	`&model=${langModel}`);
};

export { proxyAPI, liveDecodeSocket };
