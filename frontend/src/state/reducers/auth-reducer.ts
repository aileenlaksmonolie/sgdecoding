import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Token } from '../../models/access-token.model';
import { AuthAction } from '../actions-types/auth-actions.types';
import { AuthTypes } from '../types/index';

export const INITIAL_STATE = {
	token : '',
	rmbMeEmail: '',
	exp: new Date(),
	name: '',
	role: '',
	sub: '',
	email:'',
	logoutMsg: ''
};

const reducer = (state = INITIAL_STATE, action: AuthAction) => {
	switch (action.type) {
		case AuthTypes.RMB_ME:
			const { rmbMeEmail } = action;
			return {...state, rmbMeEmail };

		case AuthTypes.LOGIN_SUCCESS:
			const { token } = action;
			const { exp, name, role, sub, email } = jwtDecode<JwtPayload>(token) as Token;
			return { ...state, token, exp: new Date(exp * 1000), name, role, sub, email };

		case AuthTypes.SET_NEW_NAME:
			const { newName } = action;
			return { ...state, name: newName };

		case AuthTypes.SET_LOGOUT_MSG:
			const { logoutMsg } = action;
			return { ...state, logoutMsg };
		case AuthTypes.DELETE_LOGOUT_MSG:
			return { ...state, logoutMsg: ''};
		case AuthTypes.DELETE_TOKEN:
			return { ...state, token: ''};

		default:
			return state;
	}
};

export default reducer;