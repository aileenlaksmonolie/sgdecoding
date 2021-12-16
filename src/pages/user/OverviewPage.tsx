import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../state';

const OverviewPage: React.FC = () => {

	const dispatch = useDispatch();
	const { logout } = bindActionCreators(actionCreators, dispatch)

	return (<div>
		<h1>Overview Page</h1>
		<span>Logged In Successfully</span>
		<button onClick={logout}>Logout</button>
	</div>)
}

export default React.memo(OverviewPage);