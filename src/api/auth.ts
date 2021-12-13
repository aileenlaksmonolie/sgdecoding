import { UserLoginModel } from './../models/UserLogin.model';
import { speechGatewayApi } from "./api";

export const loginOneUser = (userCreds: UserLoginModel) => {
	return speechGatewayApi.post(
		`/auth/login`, 
		{ email: userCreds.email, password: userCreds.password }
	)
}

export const registerOneUser = () => {
	//TODO
	console.warn('TO BE DONE')
}