import jwtDecode, { JwtPayload } from 'jwt-decode';
import { AuthAction } from '../actions/AuthAction';
import { AuthTypes } from '../types/index';
import { Token } from './../../models/AccessToken.model';

export const INITIAL_STATE = {
	token : '',
	rmbMeEmail: '',
	exp: new Date(),
	name: '',
	role: '',
	sub: '',
}

const reducer = (state = INITIAL_STATE, action: AuthAction) => {
	switch (action.type) {
		case AuthTypes.RMB_ME:
			const { rmbMeEmail } = action
			return {...state, rmbMeEmail }
		case AuthTypes.LOGIN_SUCCESS:
			const { token } = action
			const { exp, name, role, sub } = jwtDecode<JwtPayload>(token) as Token
			return { ...state, token, exp: new Date(exp * 1000), name, role, sub }
		case AuthTypes.LOGOUT:
		case AuthTypes.LOGIN_FAIL:
			return { ...state, token: '' }
		default:
			return state
	}
}

export default reducer