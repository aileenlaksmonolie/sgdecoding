import { AuthAction } from '../actions/AuthAction';
import { AuthTypes } from '../types/index';

export const INITIAL_STATE = {
	token : '',
	rmbMeEmail: ''
}

const reducer = (state = INITIAL_STATE, action: AuthAction) => {
	switch (action.type) {
		case AuthTypes.RMB_ME:
			const { rmbMeEmail } = action
			return {...state, rmbMeEmail }
		case AuthTypes.LOGIN_SUCCESS:
			const { token } = action
			return { ...state, token }
		case AuthTypes.LOGOUT:
		case AuthTypes.LOGIN_FAIL:
			console.log("[DEBUG] Reducer: logging out?") 
			return { ...state, token: '' }
		default:
			return state
	}
}

export default reducer