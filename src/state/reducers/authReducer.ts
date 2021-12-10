import { AuthTypes } from '../types/index';
import { AuthAction } from './../actions/AuthAction';


const reducer = (isLoggedIn: boolean = false, action: AuthAction): boolean => {
	switch(action.type){
		case AuthTypes.LOGIN:
			//TODO API calls
			console.log("[debug] login case in reducer")
			isLoggedIn = true
			return isLoggedIn
		case AuthTypes.LOGOUT:
			//TODO 
			isLoggedIn = false
			return isLoggedIn
		default: 
			return isLoggedIn
	}
}

export default reducer