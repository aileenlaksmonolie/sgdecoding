import { AuthTypes } from '../types';

interface ILoginAction{
	type: AuthTypes.LOGIN,
	username: string,
	password: string,
	rmbMe: boolean
}

interface ILogoutAction{
	type: AuthTypes.LOGOUT
}


export type AuthAction = ILoginAction | ILogoutAction;