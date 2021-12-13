import React from 'react';
import { Grid } from 'semantic-ui-react';
import LoginCard from '../components/authentication/LoginCard';

const LoginPage: React.FC = () => {

	return (
		<Grid centered verticalAlign='middle'>
			<Grid.Row>
				<LoginCard />
			</Grid.Row>
		</Grid>
	)
}

export default React.memo(LoginPage)