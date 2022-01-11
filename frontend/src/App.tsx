import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/authentication/protected.route';
import AuthenticationModule from './pages/authentication/authentication.module';
import NotFoundPage from './pages/authentication/not-found.page';
import UserModule from './pages/user/User.module';


function App() {

	return (
		<Routes>
			<Route path='/*' element={<ProtectedRoute><UserModule /></ProtectedRoute>} />
			<Route path='/auth/*' element={<AuthenticationModule />}></Route>
			<Route path='*' element={<NotFoundPage />}></Route>
		</Routes>
	);
}

export default App;

