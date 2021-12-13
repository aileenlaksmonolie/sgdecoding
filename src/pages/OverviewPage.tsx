import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/reducers';

const OverviewPage:React.FC = () => {
	const isLoggedIn = useSelector((state: RootState) => state.authReducer)
	
	console.log(isLoggedIn) 

	return <div>Overview works!</div>
}

export default React.memo(OverviewPage);