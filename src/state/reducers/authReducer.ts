import { AuthTypes } from '../types/index';
import { AuthAction } from './../actions/AuthAction';


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