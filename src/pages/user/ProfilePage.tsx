import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Checkbox, CheckboxProps, Container, Form, InputOnChangeData, Message, Header } from 'semantic-ui-react';
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

export default React.memo(ProfilePage);