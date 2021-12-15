import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

const OverviewPage: React.FC = () => {
	// const isLoggedIn = useSelector((state: RootState) => state.authReducer.token) !== ''

	const dispatch = useDispatch();
	const { logout } = bindActionCreators(actionCreators, dispatch)

	return (<div>
		<h1>Login Successfully!</h1>
		<button onClick={logout}>Logout</button>
	</div>)
}

export default React.memo(OverviewPage);