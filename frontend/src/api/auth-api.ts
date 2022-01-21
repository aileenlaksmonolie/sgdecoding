import { NewUserRegistration, UserChangeName, UserChangePassword, UserLoginModel, UserResetPassword } from '../models/user-authentication.model';
import { speechGatewayApi } from "./api";

export const loginOneUser = (userCreds: UserLoginModel) => {
	return speechGatewayApi.post(
		`/auth/login`, 
		{ email: userCreds.email, password: userCreds.password }
	);
};

export const registerOneUser = (newUser: NewUserRegistration) => {
	return speechGatewayApi.post(
		`/auth/register`,
		{ name: newUser.name, email: newUser.email, password: newUser.password },
		{ responseType: 'json' }
	);
};

export const sendForgotPasswordRequest = (email: string) => {
	return speechGatewayApi.post(
		`/auth/forgot-password`,
		{ email },
		{ responseType: 'json'}
	);
};

export const sendResetPasswordRequest = (newPasswordRequest: UserResetPassword) => {
	return speechGatewayApi.post(
		`/auth/reset-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	);
};

export const sendChangePasswordRequest = (newPasswordRequest: UserChangePassword) => {
	return speechGatewayApi.post(
		`/auth/change-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	);
};

export const sendChangeNameRequest = (newNameRequest: UserChangeName) => {
	return speechGatewayApi.post(
		`/users/change-name`,
		newNameRequest,
		{responseType: 'json'}	
	);
};

export const getStatistics = (userID: string) => {
	return speechGatewayApi.post(
		`/users/statistics`,
		{ userID },
		{responseType: 'json'}
	);
};

export const updateLastLogin = (userID: string) => {
	return speechGatewayApi.post(
		`/update-last-login`,
		{ userID },
		{responseType: 'json'}
	);
};

export const getLastLogin = (userID: string) => {
	return speechGatewayApi.post(
		`/last-login`,
		{ userID },
		{responseType: 'json'}
	);
};