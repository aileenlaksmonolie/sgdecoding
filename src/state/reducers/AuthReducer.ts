import { AuthAction } from '../actions/AuthAction';
import { AuthTypes } from '../types/index';

export const INITIAL_STATE = {
	accessToken : '' 
}

const reducer = (isLoggedIn: boolean = false, action: AuthAction): boolean => {
	switch (action.type) {
		case AuthTypes.LOGIN_SUCCESS:
			isLoggedIn = true
			return isLoggedIn
		case AuthTypes.LOGOUT:
			isLoggedIn = false
			return isLoggedIn
		default:
			return isLoggedIn
	}
}

export default reducer