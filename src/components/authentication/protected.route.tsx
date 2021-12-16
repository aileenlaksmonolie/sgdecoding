
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, RouteProps } from 'react-router-dom';
import { RootState } from '../../state/reducers';

export type ProtectedRouteProps = {
	children: JSX.Element
} & RouteProps;

// export default function ProtectedRoute({isAuthenticated, authenticationPath, ...routeProps}: ProtectedRouteProps) {
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
	const isLoggedIn = useSelector((state: RootState) => state.authReducer.token) !== ''

  if(isLoggedIn) {
		console.info("[DEBUG] ProtectedRoute: User is logged in, navigating to protected route") 
		return children;
  }

	console.info("[DEBUG] ProtectedRoute: User is NOT logged in, going to /login") 
  return <Navigate to='/auth/login' />;
};