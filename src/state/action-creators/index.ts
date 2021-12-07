import { Dispatch } from "redux"
import { TestType } from "../action-types"


export const addToStoreTest = (num: number) => {
	return (dispatch: Dispatch) => {
		dispatch({
			type: TestType.ADD,
			payload: num
		})
	}
}

export const subToStoreTest = (num: number) => {
	return (dispatch: Dispatch) => {
		dispatch({
			type: TestType.MINUS,
			payload: num
		})
	}
}