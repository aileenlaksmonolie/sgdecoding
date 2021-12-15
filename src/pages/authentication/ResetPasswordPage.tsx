import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import { sendResetPasswordRequest } from '../../api/auth';
import { UserResetPassword, UserResetPasswordResponse } from '../../models/UserResetPassword.model';
import { RootState } from '../../state/reducers';
import classes from './Authentication.module.scss';

const ResetPasswordPage: React.FC = () => {
	/* Declarations */
	const [formMessage, setFormMessage] = useState({ isShown: false, isError: false, msg: '' })
	const [isDisabled, setIsDiabled] = useState(false)

	const {search} = useLocation()
	const code = new URLSearchParams(search).get('code')!
	const email = new URLSearchParams(search).get('email')!
	// console.log("[DEBUG] " + code) 
	// console.log("[DEBUG] " + email)

	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const password = useRef({})
	password.current = watch('password', '')

	const { token } = useSelector((state: RootState) => state.authReducer)
	const isLoggedIn = token !== ''

	useEffect(() => {
		register("password", {
			required: 'Password field is empty!',
			minLength: {
				value: 6,
				message: 'Password is too short!'
			}
		})
		register("passwordCfm", {
			validate: v => v === password.current || 'The passwords do not match'
		});

		if (isLoggedIn)
			navigate('/')

		if(email === null || code === null){
			setFormMessage({isShown: true, isError: true, msg: 'Invalid Reset Password Link!'})
			setIsDiabled(true)
		}
	}, [isLoggedIn, navigate, register, email, code])


	/* Event Handlers */
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		// setValue(name, value, { shouldValidate: true})
		setValue(name, value)
	}

	const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setValue(name, value, { shouldValidate: true })
	}

	const onSubmit = async (data: { password: string, passwordCfm: string }) => {
		// console.log("[DEBUG] onSubmit: ")
		// console.log(data)

		const newPasswordRequest: UserResetPassword = {
			email,
			newPassword: data.password,
			confirmNewPassword: data.passwordCfm,
			code
		}

		sendResetPasswordRequest(newPasswordRequest)
			.then((res: AxiosResponse<UserResetPasswordResponse, any>) => {
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
			<Container className={classes.cardHeader}>
				<h1>Reset Password</h1>
				<small>Enter your new password</small>
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
					header= {formMessage.isError ? 'Reset Password Unsuccessful' : 'Reset Password Successful'}
					content={formMessage.msg}
				/>
				<Form.Field>
					<Form.Input
						fluid
						label="Password"
						name="password"
						type='password'
						placeholder='Password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						disabled={isDisabled}
						error={errors.password ? { content: errors.password.message } : false}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						fluid
						label="Confirm Password"
						name="passwordCfm"
						type='password'
						placeholder='Enter password again'
						onChange={onInputChange}
						onBlur={onInputBlur}
						disabled={isDisabled}
						error={errors.passwordCfm ? { content: errors.passwordCfm.message } : false}
					/>
				</Form.Field>
				
				<Button
					className={classes.registerBtn}
					fluid
					primary
					type='submit'>
					Reset My Password
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

export default React.memo(ResetPasswordPage)