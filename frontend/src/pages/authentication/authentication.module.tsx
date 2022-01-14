import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Card, Grid, Image } from 'semantic-ui-react';
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

			<div id={styles.acknow}>
				<p>A joint-project in collaboration between</p>
				<Image src="/images/logo_bw_ntu.svg" alt="" />
				<Image src="/images/logo_bw_nus.svg" alt="" />
				<Image src="/images/logo_bw_abax.svg" alt="" />
				<Image src="/images/logo_bw_ai_sg.svg" alt="" />
			</div>

		</div>
	);
};

export default AuthenticationModule;