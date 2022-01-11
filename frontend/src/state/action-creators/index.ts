import { Dispatch } from "redux";
import { TestType } from "../types/index";

export const addToStoreTest = (num: number) => {
	return (dispatch: Dispatch) => {
		dispatch({
			type: TestType.ADD,
			payload: num
		});
	};
};

export const subToStoreTest = (num: number) => {
	return (dispatch: Dispatch) => {
		dispatch({
			type: TestType.MINUS,
			payload: num
		});
	};
};

export * from './auth-ac';
export * from './transcript-history-ac';

