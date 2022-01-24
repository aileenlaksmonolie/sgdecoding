import { AuthTypes } from '../types/index';

interface RememberMeAction{
	type: AuthTypes.RMB_ME,
	rmbMeEmail: string
}

interface LoginSuccessAction{
	type: AuthTypes.LOGIN_SUCCESS,
	token: string,
}


interface DeleteTokenAction{
	type: AuthTypes.DELETE_TOKEN,
}

interface SetLogoutMsgAction{
	type: AuthTypes.SET_LOGOUT_MSG,
	logoutMsg: string
}

interface DeleteLogoutMsgAction{
	type: AuthTypes.DELETE_LOGOUT_MSG
}

interface ChangeNameSuccessAction{
	type: AuthTypes.SET_NEW_NAME,
	newName: string
}


export type AuthAction = RememberMeAction | LoginSuccessAction 
												| SetLogoutMsgAction | DeleteLogoutMsgAction 
												| ChangeNameSuccessAction | DeleteTokenAction;