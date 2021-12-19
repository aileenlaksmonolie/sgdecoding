import React, { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Button, Card, Checkbox, CheckboxProps, Container, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import { UserLoginModel } from '../../models/UserLogin.model';
import { actionCreators } from '../../state';
import { RootState } from '../../state/reducers';
import classes from './Authentication.module.scss';


const LoginPage: React.FC = () => {
	/* Declarations */
	const [showError, setShowError] = useState(false)
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const { rmbMeEmail, token } = useSelector((state: RootState) => state.authReducer)
	const isLoggedIn = token !== ''

	// console.log("[DEBUG] isLoggedIn " + isLoggedIn)

	const dispatch = useDispatch();
	const { login } = bindActionCreators(actionCreators, dispatch)

	// console.log("[DEBUG] rmbMeEmail: " + rmbMeEmail)
	if (rmbMeEmail !== '') {
		setValue('email', rmbMeEmail)
		setValue('rmbMe', true)
	}

	useEffect(() => {
		register("email", {
			required: 'Email field is empty!',
			pattern: {
				value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
				message: 'Invalid email address!'
			}
		});
		register("password", {
			required: 'Password field is empty!',
			minLength: {
				value: 6,
				message: 'Password is too short!'
			}
		});
		register('rmbMe')

		if (isLoggedIn)
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

	const onRmbMeChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setValue('rmbMe', data.checked)
	}

	const onSubmit = async (data: { email: string, password: string, rmbMe: undefined | boolean }) => {
		// console.log("[DEBUG] LoginCard rmbMe: " + data.rmbMe)
		const userCreds: UserLoginModel = {
			email: data.email,
			password: data.password,
			rmbMe: data.rmbMe === undefined ? false : true
		}
		try {
			await login(userCreds)
		} catch (err) {
			// console.log("[DEBUG] Error logging in!")
			setShowError(true)
		}

		// console.log("[DEBUG] Submitted, is user logged in? " + isLoggedIn)
	}
	return (
		<Card.Content>
			<Container className={classes.cardHeader}>
				<h1>Welcome Back</h1>
				<small>Sign in to continue</small>
			</Container>
			<Form
				onSubmit={handleSubmit(onSubmit)}
				error={showError}
				noValidate>
				<Message
					error
					header='Login Unsuccessful'
					content='We cannot find the email and/or password that you had entered in our records. Please check and try again.'
				/>
				<Form.Field>
					<Form.Input
						name='email'
						label='Email'
						fluid
						type='email'
						defaultValue={rmbMeEmail}
						placeholder='example@ntu.edu.sg'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.email ? { content: errors.email.message } : false}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						fluid
						label="Password"
						name="password"
						type='password'
						placeholder='Password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.password ? { content: errors.password.message } : false}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox
						name="rmbMe"
						label='Remember Me?'
						onChange={onRmbMeChange}
						defaultChecked={rmbMeEmail !== ''}
					/>
				</Form.Field>
				<Button
					fluid
					primary
					type='submit'>
					Login
				</Button>
			</Form>
			<Link to='/auth/forgotpassword'><em>Forgot your password?</em></Link>
			<h4>Don't have an account?
				<em><Link to='/auth/register'> Register here</Link></em>
			</h4>
		</Card.Content>);
}

export default React.memo(LoginPage)