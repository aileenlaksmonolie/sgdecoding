import React from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'semantic-ui-react';
import { actionCreators } from '../../state';

const OverviewPage: React.FC = () => {

	const dispatch = useDispatch();
	const { logout } = bindActionCreators(actionCreators, dispatch)

	return (<Container>
		<h1>Overview Page</h1>
		<span>Logged In Successfully</span>
		<button onClick={logout}>Logout</button>
	</Container>)
}

export default React.memo(OverviewPage);