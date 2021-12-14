import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Grid } from 'semantic-ui-react';
import LoginForm from '../components/authentication/LoginForm';
import classes from './LoginPage.module.scss';


const LoginPage: React.FC = () => (
	<Grid centered verticalAlign='middle'>
		<Grid.Row>
			<Card>
				<Card.Content>
					<Container className={classes.welcomeBackHeader}>
						<h1>Welcome Back</h1>
						<small>Sign in to continue</small>
					</Container>
					<LoginForm />
					<h4>Don't have an account?
						<em><Link to='/auth/register'> Register here</Link></em>
					</h4>
				</Card.Content>
			</Card>
		</Grid.Row>
	</Grid>
)

export default React.memo(LoginPage)