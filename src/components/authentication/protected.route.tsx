
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

  if(isLoggedIn) {
		console.log("user is logged in, navigate to child node")
		return children;
  }
  return <Navigate to='/login' />;
};