import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import { sendChangePasswordRequest } from '../../api/auth-api';
import { UserChangePassword, UserChangePasswordResponse } from '../../models/UserChangePassword.model';
import { RootState } from '../../state/reducers';

const ChangePasswordPage: React.FC = () => {
	/* Declarations */
	const [formMessage, setFormMessage] = useState({ isShown: false, isError: false, msg: '' })
	// const [isDisabled, setIsDiabled] = useState(false)

	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const newPassword = useRef({})
	newPassword.current = watch('newPassword', '')

	const { token, rmbMeEmail } = useSelector((state: RootState) => state.authReducer)
	const isLoggedIn = token !== ''

	useEffect(() => {
		register("currentPassword", {
			required: 'Password field is empty!',
		})
		register("newPassword", {
			required: 'Password field is empty!',
			minLength: {
				value: 6,
				message: 'Password is too short!'
			}
		})
		register("passwordCfm", {
			validate: v => v === newPassword.current || 'The passwords do not match'
		});

		if (!isLoggedIn)
			navigate('/')

	}, [isLoggedIn, navigate, register])

	/* Event Handlers */
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		// setValue(name, value, { shouldValidate: true})
		setValue(name, value)
	}

	const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setValue(name, value, { shouldValidate: true })
	}

	const onSubmit = async (data: { currentPassword: string, newPassword: string, passwordCfm: string }) => {
		// console.log("[DEBUG] onSubmit: ")
		// console.log(data)

		const newPasswordRequest: UserChangePassword = {
			email: rmbMeEmail,
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
			confirmNewPassword: data.passwordCfm,
		}

		sendChangePasswordRequest(newPasswordRequest)
			.then((res: AxiosResponse<UserChangePasswordResponse, any>) => {
				// console.log("[DEBUG] Successful Reset") 
				setFormMessage({ isShown: true, isError: false, msg: res.data.message })
			})
			.catch((err: AxiosError) => {
				// console.log("[DEBUG] Error Resetting!")
				// console.log(err.response)
				setFormMessage({ isShown: true, isError: true, msg: err.message })
			})
		
	}

	return (
		<Card.Content>
			<Container>
				<h1>Change Password</h1>
			</Container>

			<Form
				onSubmit={handleSubmit(onSubmit)}
				// {...formMessage.isError ? 'error' : 'positive' }
				error={formMessage.isShown && formMessage.isError}
				noValidate>
				<Message
					hidden={formMessage.isShown === false}
					error={formMessage.isError === true}
					positive={formMessage.isError === false}
					header= {formMessage.isError ? 'Change Password Unsuccessful' : 'Change Password Successful'}
					content={formMessage.msg}
				/>
				<Form.Field>
					<Form.Input
						fluid
						label="Current Password"
						name="currentPassword"
						type='password'
						placeholder='Enter current password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						// disabled={isDisabled}
						error={errors.currentPassword ? { content: errors.currentPassword.message } : false}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						fluid
						label="New Password"
						name="newPassword"
						type='password'
						placeholder='Enter new password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						// disabled={isDisabled}
						error={errors.newPassword ? { content: errors.newPassword.message } : false}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						fluid
						label="Confirm Password"
						name="passwordCfm"
						type='password'
						placeholder='Enter new password again'
						onChange={onInputChange}
						onBlur={onInputBlur}
						// disabled={isDisabled}
						error={errors.passwordCfm ? { content: errors.passwordCfm.message } : false}
					/>
				</Form.Field>
				
				<Button
					//className={classes.registerBtn}
					fluid
					primary
					type='submit'>
					Change My Password
				</Button>

				<Button
					//className={classes.goBackBtn}
					fluid
					basic
					onClick={() => navigate('/auth/login')}>
					Go Back
				</Button>

			</Form>

		</Card.Content>
	)
}

export default ChangePasswordPage