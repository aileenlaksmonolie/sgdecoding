import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Card, Grid } from 'semantic-ui-react';
import ForgotPwdPage from './ForgotPwdPage';
import LoginPage from "./LoginPage";
import RegisterPage from './RegisterPage';
import ResetPasswordPage from './ResetPasswordPage';


const AuthenticationModule: React.FC = () => {

	return (
		<Grid centered verticalAlign='middle'>
			<Grid.Row>
				<Card>
						<Routes>
							<Route path='login' element={<LoginPage />} />
							<Route path='register' element={<RegisterPage />} />
							<Route path='forgotpassword' element={<ForgotPwdPage />} />
							<Route path='resetpassword' element={<ResetPasswordPage/>} />
						</Routes>
				</Card>
			</Grid.Row>
		</Grid>
	);
}

export default AuthenticationModule