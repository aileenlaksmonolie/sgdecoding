import { AuthTypes } from './../types/index';

interface LoginSuccessAction{
	type: AuthTypes.LOGIN_SUCCESS,
	token: string
}

interface LoginFailureAction{
	type: AuthTypes.LOGIN_FAIL
}

interface LogoutAction{
	type: AuthTypes.LOGOUT
}


export type AuthAction = LoginSuccessAction | LoginFailureAction | LogoutAction;