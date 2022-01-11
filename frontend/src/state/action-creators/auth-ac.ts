import { Dispatch } from "redux";
import { loginOneUser } from "../../api/auth-api";
import { UserLoginModel } from "../../models/user-authentication.model";
import { AuthAction } from "../actions-types/auth-actions.types";
import { AuthTypes } from '../types/index';


export const login = (userCreds: UserLoginModel) => {
	return async (dispatch: Dispatch) => {

		if(userCreds.rmbMe){
			let rmbMe: AuthAction = {
				type: AuthTypes.RMB_ME,
				rmbMeEmail: userCreds.email
			}
			dispatch(rmbMe)
		}

		await loginOneUser(userCreds)
			.then(({data}) => {
				let loginSuccess: AuthAction = {
					type: AuthTypes.LOGIN_SUCCESS,
					token: data.accessToken
				}
				dispatch(loginSuccess)
				return Promise.resolve()
			}).catch((error) => {
				console.log('test')
				console.error(error);

				let loginFail: AuthAction = {
					type: AuthTypes.LOGIN_FAIL
				}

				dispatch(loginFail)
				return Promise.reject()
			})
	}
}

// export const register = (newUser: UserRegisterModel) => {
// 	return async (dispatch: Dispatch) => {
// 		console.log("[DEBUG] register action creator")

// 		await registerOneUser(newUser)
// 			.then(({data}) => {
// 				console.log("[DEBUG] Registration Successful") 
// 				console.log(data)
				
// 				return Promise.resolve()
// 			})
// 			.catch((error) => {
// 				console.log(error)
// 				return Promise.reject()
// 			})

// 	}
// }

export const logout = () => {

	return (dispatch: Dispatch) => {
		let logoutAction: AuthAction = {
			type: AuthTypes.LOGOUT
		}

		dispatch(logoutAction)
	}
}
