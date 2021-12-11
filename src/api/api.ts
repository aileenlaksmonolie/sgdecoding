import axios from "axios";

export const speechGatewayApi = axios.create({
	baseURL: process.env.REACT_APP_SPEECH_GATEWAY
}) 