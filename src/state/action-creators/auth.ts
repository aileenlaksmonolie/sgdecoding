import { Dispatch } from "redux";
import { loginOneUser } from "../../api/auth";
import { AuthTypes } from '../types/index';
import { UserLoginModel } from './../../models/UserLogin.model';
import { AuthAction } from './../actions/AuthAction';


export const login = (userCreds: UserLoginModel) => {
	return async (dispatch: Dispatch) => {
		console.log("[DEBUG] login dispatched");
		await loginOneUser(userCreds)
			.then(({data}) => {
				console.log("Login Successful")
				console.log(data)
				let loginSuccess: AuthAction = {
					type: AuthTypes.LOGIN_SUCCESS,
					token: data.accessToken
				}
				dispatch(loginSuccess)
				return Promise.resolve();
			}).catch(({ error }) => {
				console.error(error);
				let loginFail: AuthAction = {
					type: AuthTypes.LOGIN_FAIL
				}
				dispatch(loginFail)
				return Promise.resolve();
			})
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
