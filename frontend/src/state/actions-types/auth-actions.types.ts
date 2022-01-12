import { AuthTypes } from '../types/index';

interface RememberMeAction{
	type: AuthTypes.RMB_ME,
	rmbMeEmail: string
}

interface LoginSuccessAction{
	type: AuthTypes.LOGIN_SUCCESS,
	token: string,
}

interface LoginFailureAction{
	type: AuthTypes.LOGIN_FAIL
}


interface LogoutAction{
	type: AuthTypes.LOGOUT
}

interface ChangeNameSuccessAction{
	type: AuthTypes.SET_NEW_NAME,
	newName: string
}


export type AuthAction = RememberMeAction | LoginSuccessAction 
													| LoginFailureAction | LogoutAction 
													| ChangeNameSuccessAction;