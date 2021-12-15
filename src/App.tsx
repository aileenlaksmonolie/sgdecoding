import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/authentication/protected.route';
import AuthenticationModule from './pages/authentication/Authentication.module';
import NotFoundPage from './pages/authentication/NotFoundPage';
import OverviewPage from './pages/OverviewPage';

function App() {

	return (
		<Routes>
			<Route path='/' element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
			<Route path='/auth/*' element={<AuthenticationModule />}></Route>
			<Route path='*' element={<NotFoundPage />}></Route>
		</Routes>
	);
}

export default App;

