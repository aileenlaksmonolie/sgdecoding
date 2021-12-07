import { TestType } from './../action-types/index';

interface AddAction{
	type: TestType.ADD,
	payload: number
}

interface MinusAction{
	type: TestType.MINUS,
	payload: number
}

export type Action = AddAction | MinusAction;