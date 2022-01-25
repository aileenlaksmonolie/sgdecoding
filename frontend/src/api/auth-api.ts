import { NewUserRegistration, UserChangeName, UserChangePassword, UserLoginModel, UserResetPassword } from '../models/user-authentication.model';
import { proxyAPI } from './api';

export const loginOneUser = (userCreds: UserLoginModel) => {
	return proxyAPI.post(
		`/api/auth/login`, 
		{ email: userCreds.email, password: userCreds.password }
	);
};

export const registerOneUser = (newUser: NewUserRegistration) => {
	return proxyAPI.post(
		`/api/auth/register`,
		{ name: newUser.name, email: newUser.email, password: newUser.password },
		{ responseType: 'json' }
	);
};

export const sendForgotPasswordRequest = (email: string) => {
	return proxyAPI.post(
		`/api/auth/forgot-password`,
		{ email },
		{ responseType: 'json'}
	);
};

export const sendResetPasswordRequest = (newPasswordRequest: UserResetPassword) => {
	return proxyAPI.post(
		`/api/auth/reset-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	);
};

export const sendChangePasswordRequest = (newPasswordRequest: UserChangePassword) => {
	return proxyAPI.post(
		`/api/auth/change-password`,
		newPasswordRequest,
		{responseType: 'json'}	
	);
};

export const sendChangeNameRequest = (newNameRequest: UserChangeName) => {
	return proxyAPI.post(
		`/api/users/change-name`,
		newNameRequest,
		{responseType: 'json'}	
	);
};

export const getStatistics = (userID: string) => {
	return proxyAPI.post(
		`/api/users/statistics`,
		{ userID },
		{responseType: 'json'}
	);
};
