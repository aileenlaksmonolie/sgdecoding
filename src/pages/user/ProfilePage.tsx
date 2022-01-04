import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { RootState } from '../../state/reducers';

const ProfilePage: React.FC = () => {
		const { name, role, rmbMeEmail } = useSelector((state: RootState) => state.authReducer)
	return (
		<Card.Group>
		<Card>
			<Card.Content>
			<Card.Header>Username</Card.Header>
			<Card.Description>
				<strong>{name}</strong>
			</Card.Description>
			</Card.Content>
		</Card>
		<Card>
			<Card.Content>
			<Card.Header>Email Address</Card.Header>
			<Card.Description>
				<strong>{rmbMeEmail}</strong>
			</Card.Description>
			</Card.Content>
		</Card>
		<Card>
			<Card.Content>
			<Card.Header>Role</Card.Header>
			<Card.Description>
				<strong>{role}</strong>
			</Card.Description>
			</Card.Content>
		</Card>
		<Card>
			<Card.Content>
			<Card.Header>User Type</Card.Header>
			<Card.Description>
				<strong></strong>
			</Card.Description>
			</Card.Content>
		</Card>
		</Card.Group>
  );
}

export default ProfilePage;