import { Dispatch } from "redux";
import { loginOneUser } from "../../api/auth";
import { UserLoginModel } from '../../models/UserLogin.model';
import { AuthAction } from '../actions/AuthAction';
import { AuthTypes } from '../types/index';


export const login = (userCreds: UserLoginModel) => {
	return async (dispatch: Dispatch) => {
		console.log("[DEBUG] login dispatched");

		if(userCreds.rmbMe){
			let rmbMe: AuthAction = {
				type: AuthTypes.RMB_ME,
				rmbMeEmail: userCreds.email
			}
			console.log("[DEBUG] Remember Me Action dispatched") 
			dispatch(rmbMe)
		}

		await loginOneUser(userCreds)
			.then(({data}) => {
				console.log("Login Successful")
				let loginSuccess: AuthAction = {
					type: AuthTypes.LOGIN_SUCCESS,
					token: data.accessToken
				}
				dispatch(loginSuccess)
				return Promise.resolve();
			}).catch((error) => {
				console.error(error);
				let loginFail: AuthAction = {
					type: AuthTypes.LOGIN_FAIL
				}
				dispatch(loginFail)
				return Promise.reject();
			})
	}
}

export const logout = () => {

	return (dispatch: Dispatch) => {
		console.log("[DEBUG] logout action creator called") 
		let logoutAction: AuthAction = {
			type: AuthTypes.LOGOUT
		}

		dispatch(logoutAction)
	}
}
