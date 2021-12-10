import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { RootState } from '../state/reducers';

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn)

	const dispatch = useDispatch();
	const { login, logout } = bindActionCreators(actionCreators, dispatch);

	
	const handleLogin = () => {
		login()
		navigate('/')
	}

	const handleLogout = () => {
		logout()
	}

	return (
		<div>
			LoginPage
			<button onClick={handleLogin}>Login</button>
			<button onClick={handleLogout}>Logout</button>
		</div>
	)
}

export default LoginPage