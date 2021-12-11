import { Dispatch } from "redux";
import { AuthTypes } from '../types/index';
import { loginOneUser } from './../../api/auth';
import { AuthAction } from './../actions/AuthAction';


export const login = () => {
	return async (dispatch: Dispatch) => {
		console.log("[DEBUG] login called");
		let loginAction: AuthAction = {
			type: AuthTypes.LOGIN,
			username: "Hello World",
			password: "Password123",
			rmbMe: true
		}

		await loginOneUser().then(({data}) => {
			console.log(data);
		});

		console.log("login successfully")

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