import React from "react";
import { Card, Container, Grid } from "semantic-ui-react";
import RegisterForm from "../components/authentication/RegisterForm";


const RegisterPage: React.FC = () => {

	return (
		<Grid centered>
			<Grid.Row>
				<Card>
					<Card.Content>
						<Container textAlign='left'>
							<h1>Register a New Account</h1>
							<small>Join us today by creating a new account!</small>
						</Container>

						<RegisterForm />

					</Card.Content>
				</Card>
			</Grid.Row>
		</Grid>
	);
}

export default React.memo(RegisterPage)