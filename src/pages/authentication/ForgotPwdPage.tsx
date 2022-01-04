import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import { sendForgotPasswordRequest } from '../../api/auth-api';
import { RootState } from '../../state/reducers';
import classes from './Authentication.module.scss';

const ForgotPwdPage: React.FC = () => {
	/* Declarations */
	const [showMsg, setShowMsg] = useState(false)
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const { token } = useSelector((state: RootState) => state.authReducer)
	const isLoggedIn = token !== ''

	useEffect(() => {
		register("email", {
			required: 'Email field is empty!',
			pattern: {
				value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
				message: 'Invalid email address!'
			}
		});

		if (isLoggedIn)
			navigate('/')

	}, [isLoggedIn, navigate, register])


	/* Event Handlers */
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		setValue(name, value)
	}

	const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setValue(name, value, { shouldValidate: true })
	}

	const onSubmit = async (data: { email: string }) => {
		sendForgotPasswordRequest(data.email)
		setShowMsg(true)
	}



	return (
		<Card.Content>
			<Container className={classes.cardHeader}>
				<h1>Forgot Your Password?</h1>
				<small>Enter your email and we'll recover your account!</small>
			</Container>
			<Form
				onSubmit={handleSubmit(onSubmit)}
				noValidate>
				<Message
					hidden={showMsg === false}
					positive
					header='Recovery Request Sent Successfully'
					content='If the account exists, you should receive a recovery email in your inbox.'
				/>
				<Form.Field>
					<Form.Input
						name='email'
						label='Email'
						fluid
						type='email'
						placeholder='example@ntu.edu.sg'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.email ? { content: errors.email.message } : false}
					/>
				</Form.Field>
				<Button
					fluid
					primary
					type='submit'>
					Recover My Account
				</Button>

				<Button
					className={classes.goBackBtn}
					fluid
					basic
					onClick={() => navigate('/auth/login')}>
					Go Back
				</Button>

			</Form>
		</Card.Content>
	);
}

export default React.memo(ForgotPwdPage)