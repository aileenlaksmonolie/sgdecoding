import { Dispatch } from "redux";
import { loginOneUser } from "../../api/auth-api";
import { UserLoginModel } from "../../models/user-authentication.model";
import { AuthAction } from "../actions-types/auth-actions.types";
import { AuthTypes } from '../types/index';
import { sendChangeNameRequest } from './../../api/auth-api';
import { UserChangeName } from './../../models/user-authentication.model';


export const login = (userCreds: UserLoginModel) => {
	return async (dispatch: Dispatch) => {
		if (userCreds.rmbMe) {
			let rmbMe: AuthAction = {
				type: AuthTypes.RMB_ME,
				rmbMeEmail: userCreds.email
			};
			dispatch(rmbMe);
		}

		try {
			const { data } = await loginOneUser(userCreds);
			// console.log("Login successfully");
			console.log(data);
			let loginSuccess: AuthAction = {
				type: AuthTypes.LOGIN_SUCCESS,
				token: data.accessToken,
				lastLogin: data.lastLogin
			};
			dispatch(loginSuccess);

			return Promise.resolve();
		} catch (error) {
			// console.log('test');
			// console.error(error);
			return Promise.reject();
		}
	};
};

export const changeName = (newNameRequest: UserChangeName) => {
	return async (dispatch: Dispatch) => {
		if (!newNameRequest) {
			throw new Error("New Name Request is empty!");
		}

		await sendChangeNameRequest(newNameRequest)
			.then((res) => {
				console.log(res);
				let changeNameSuccess: AuthAction = {
					type: AuthTypes.SET_NEW_NAME,
					newName: newNameRequest.newName
				};
				dispatch(changeNameSuccess);
				return Promise.resolve();
			}
			).catch((err) => {
				console.log(err);
				return Promise.reject();
			});

	};
};

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
		dispatch({ type: AuthTypes.DELETE_TOKEN });
	};
};

export const setUserSubscriptionEnded = (hasEnded: boolean) => {
	return (dispatch: Dispatch) => {
		dispatch({ type: AuthTypes.SUBSCRIPTION_ENDED, hasEnded });
	};
};