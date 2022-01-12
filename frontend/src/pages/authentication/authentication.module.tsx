import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Card, Grid } from 'semantic-ui-react';
import styles from './authentication.module.scss';
import ForgotPwdPage from './forgot-pwd.page';
import LoginPage from './login.page';
import RegisterPage from './register.page';
import ResetPasswordPage from './reset-password.page';

const AuthenticationModule: React.FC = () => {

	return (
		<div id={styles.authContainer}>
			<Grid centered id={styles.authContainerGrid}>
				<Card id={styles.authCard}>
					<Routes>
						<Route path='login' element={<LoginPage />} />
						<Route path='register' element={<RegisterPage />} />
						<Route path='forgotpassword' element={<ForgotPwdPage />} />
						<Route path='resetpassword' element={<ResetPasswordPage />} />
					</Routes>
				</Card>
			</Grid>
		</div>
	);
};

export default AuthenticationModule;