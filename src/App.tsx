import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/authentication/protected.route';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';

function App() {

	return (
		<Routes>
			<Route path='/' element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
			<Route path='/login' element={< LoginPage />} />
		</Routes>
	);
}

export default App;
