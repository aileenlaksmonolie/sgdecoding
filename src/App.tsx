import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/authentication/protected.route';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import OverviewPage from './pages/OverviewPage';

function App() {

	return (
		<Routes>
			<Route path='/' element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
			<Route path='/login' element={< LoginPage />} />
			<Route path='*' element={<NotFoundPage />}></Route>
		</Routes>
	);
}

export default App;

