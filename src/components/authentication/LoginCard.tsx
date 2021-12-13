import React, { FormEvent, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Button, Card, Checkbox, CheckboxProps, Form, InputOnChangeData } from "semantic-ui-react";
import { UserLoginModel } from "../../models/UserLogin.model";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import classes from './LoginCard.module.scss';

const LoginCard: React.FC = () => {

	/* Declarations */
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({ mode: 'onBlur' })

	const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn)

	const dispatch = useDispatch();
	const { login, logout } = bindActionCreators(actionCreators, dispatch)

	// console.log("[DEBUG] isLoggedIn " + isLoggedIn)

	useEffect(() => {
		register("email", {
			required: 'Email field is empty!',
			pattern: {
				value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
				message: 'Invalid email address!'
			}
		});
		register("password", { 
			required:'Password field is empty!',
			minLength: {
				value: 8,
				message: 'Password is too short!'
			}
		});
		register('rmbMe')

		if(isLoggedIn)
			navigate('/')
	}, [isLoggedIn])


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

	const onSubmit = async (data: {email: string, password: string, rmbMe: undefined|boolean}) => {
		const userCreds: UserLoginModel = {
			email: data.email,
			password: data.password,
			rmbMe: data.rmbMe === undefined ? false : true
		}
		login(userCreds)

		console.log("[DEBUG] Submitted, is user logged in? " + isLoggedIn) 
	}

	const handleLogout = () => {
		logout()
	}

	return <Card>
		<Card.Content>
			<div className={classes.welcomeBackHeader}>
				<h1>Welcome Back</h1>
				<small>Sign in to continue</small>
			</div>
			<Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
				<Form.Field>
					<Form.Input
						fluid
						label="Password"
						name="password"
						type='password'
						placeholder='Password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.password ? { content: errors.password.message} : false}
					/>
				</Form.Field>
				<Form.Field>
					<Checkbox 
						name="rmbMe" 
						label='Remember Me?'
						onChange={onRmbMeChange}
					/>
				</Form.Field>

				<Button fluid type='submit'>Login</Button>
			</Form>
			{/* <button onClick={handleLogin}>Login</button>
		<button onClick={handleLogout}>Logout</button> */}
		</Card.Content>
	</Card>
}

export default LoginCard