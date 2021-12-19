import { UserLoginModel } from './../models/UserLogin.model';
import { NewUserRegistration } from './../models/UserRegister.model';
import { UserResetPassword } from './../models/UserResetPassword.model';
import { UserChangePassword } from './../models/UserChangePassword.model';
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


export const sendForgotPasswordRequest = (email: string) => {
	return speechGatewayApi.post(
		`/auth/forgot-password`,
		{ email },
		{ responseType: 'json'}
	)
}

export const sendResetPasswordRequest = (newPasswordRequest: UserResetPassword) => {
	return speechGatewayApi.post(
		`/auth/reset-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	)
}

export const sendChangePasswordRequest = (newPasswordRequest: UserChangePassword) => {
	return speechGatewayApi.post(
		`/auth/change-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	)
}