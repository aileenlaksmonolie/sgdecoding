import { TestType } from './../action-types/index';
import { Action } from './../actions/index';

const reducer = (state: number=0, action: Action): number => {
	switch(action.type){
		case TestType.ADD:
			return state + action.payload;
		case TestType.MINUS:
			return state + action.payload;
		default:
			return state
	}
}

export default reducer