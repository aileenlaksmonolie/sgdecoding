
export enum TestType{
	ADD = "add",
	MINUS = "minus"
}

export enum AuthTypes {
	RMB_ME = 'rmbMe',
	LOGIN_SUCCESS = 'loginSuccess',
	LOGIN_FAIL = 'loginFail',
	DELETE_TOKEN = 'logout',
	SET_LOGOUT_MSG = 'setLogoutMsg',
	DELETE_LOGOUT_MSG = 'delLogoutMsg',
	SET_NEW_NAME = 'setnewname',
	ISADMIN = 'isAdmin'
}

export enum UserTranscriptionTypes{
	SET_THIS_USER_HISTORY = 'set_user_th',
	SET_SELECTED_TRANSCRIPTION_HISTORY = "set_selected_th",
	SET_SELECTED_TRANSCRIPTION_TEXT = 'set_selected_th_text'
}