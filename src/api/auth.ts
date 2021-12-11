import { speechGatewayApi } from "./api";

export const loginOneUser = () => {
	return speechGatewayApi.get(`https://api.github.com/users/defunkt`)
}

export const registerOneUser = () => {
	//TODO
	console.warn('TO BE DONE')
}