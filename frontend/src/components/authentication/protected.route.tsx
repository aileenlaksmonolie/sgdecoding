
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, RouteProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { actionCreators, store } from '../../state';
import { RootState } from '../../state/reducers';

export type ProtectedRouteProps = {
	children: JSX.Element
} & RouteProps;

// export default function ProtectedRoute({isAuthenticated, authenticationPath, ...routeProps}: ProtectedRouteProps) {
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
	const isLoggedIn = useSelector((state: RootState) => state.authReducer.token) !== '';
	const { logoutMsg } = store.getState().authReducer;
	const dispatch = useDispatch();
	const { clearLogoutMsg } = bindActionCreators(actionCreators, dispatch);

  if(isLoggedIn) {
		// console.info("[DEBUG] ProtectedRoute: User is logged in, navigating to protected route");
		return children;
  }

	let loginPath = '/auth/login';
	
	if(logoutMsg){
		loginPath += '?logoutMsg=' + logoutMsg;
		clearLogoutMsg();
	}

	// console.info("[DEBUG] ProtectedRoute: User is NOT logged in, going to /login");
  return <Navigate to={loginPath} />;
};