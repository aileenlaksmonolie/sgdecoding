import { UserLoginModel } from './../models/UserLogin.model';
import { NewUserRegistration } from './../models/UserRegister.model';
import { speechGatewayApi } from "./api";

export const loginOneUser = (userCreds: UserLoginModel) => {
	return speechGatewayApi.post(
		`/auth/login`, 
		{ email: userCreds.email, password: userCreds.password }
	)
}

export const registerOneUser = (newUser: NewUserRegistration) => {
	//TODO
	return speechGatewayApi.post(
		`/auth/register`,
		{ name: newUser.name, email: newUser.email, password: newUser.password },
		{ responseType: 'json' }
	)
}