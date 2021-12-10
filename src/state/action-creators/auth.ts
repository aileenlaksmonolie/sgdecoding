import { Dispatch } from "redux";
import { AuthTypes } from '../types/index';
import { AuthAction } from './../actions/AuthAction';

export const login = () => {
	return (dispatch: Dispatch) => {
		console.log("[DEBUG] login called");
		let loginAction: AuthAction = {
			type: AuthTypes.LOGIN,
			username: "Hello World",
			password: "Password123",
			rmbMe: true
		}

		dispatch(loginAction)
	}
}

export const logout = () => {

	return (dispatch: Dispatch) => {

		let logoutAction: AuthAction = {
			type: AuthTypes.LOGOUT
		}

		dispatch(logoutAction)
	}
}

export const isLoggedIn = (callback: Function) => {
	return (dispatch : Dispatch) => {
		dispatch({
			type: AuthTypes.ISLOGGEDIN
		})
	}
}