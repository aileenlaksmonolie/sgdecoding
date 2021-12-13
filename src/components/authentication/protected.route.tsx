
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, RouteProps } from 'react-router-dom';
import { RootState } from '../../state/reducers';

export type ProtectedRouteProps = {
  // isAuthenticated: boolean;
  // authenticationPath: string;
} & RouteProps;

// export default function ProtectedRoute({isAuthenticated, authenticationPath, ...routeProps}: ProtectedRouteProps) {
export default function ProtectedRoute({ children }: { children: JSX.Element }) {
	const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn)

	console.log(isLoggedIn)

  if(isLoggedIn) {
		console.info("[DEBUG] ProtectedRoute: User is logged in, navigating to protected route") 
		return children;
  }

	console.info("[DEBUG] ProtectedRoute: User is NOT logged in, going to /login") 
  return <Navigate to='/login' />;
};