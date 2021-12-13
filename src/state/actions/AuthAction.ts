import { AuthTypes } from './../types/index';

interface ILoginSuccessAction{
	type: AuthTypes.LOGIN_SUCCESS,
	token: string
}

interface ILoginFailureAction{
	type: AuthTypes.LOGIN_FAIL
}

interface ILogoutAction{
	type: AuthTypes.LOGOUT
}


export type AuthAction = ILoginSuccessAction | ILoginFailureAction | ILogoutAction;