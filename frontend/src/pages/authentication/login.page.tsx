import React, { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Button, Card, Checkbox, CheckboxProps, Container, Form, Header, Image, InputOnChangeData, Message } from 'semantic-ui-react';
import { UserLoginModel } from '../../models/user-authentication.model';
import { actionCreators } from '../../state';
import { RootState } from '../../state/reducers';
import authModStyles from './authentication.module.scss';
//https://stackoverflow.com/questions/71275687/type-of-handlesubmit-parameter-in-react-hook-form


const LoginPage: React.FC = () => {
	/* Declarations */
	const [showError, setShowError] = useState(false);
	const navigate = useNavigate();
	type Data = {
		 email: string, password: string, rmbMe: undefined | boolean 

	}
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({ mode: 'onBlur' });

	const { rmbMeEmail, token } = useSelector((state: RootState) => state.authReducer);
	const isLoggedIn = token !== '';
	const [isLoading, setIsLoading] = useState(false);

	//eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [searchParams, setSearchParams] = useSearchParams();
	const logoutMsg = searchParams.get('logoutMsg');
	// console.log(logoutMsg);

	const dispatch = useDispatch();
	const { login } = bindActionCreators(actionCreators, dispatch);

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
		register('rmbMe');

		// console.log("[DEBUG] rmbMeEmail: " + rmbMeEmail)
		if (rmbMeEmail !== '') {
			//setValue('email', rmbMeEmail); //email does not change
			setValue('rmbMe', true);
		}

		// if (isLoggedIn)
		// 	navigate('/');
	}, [register]);


	/* Event Handlers */
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		//setValue(name, value, { shouldValidate: true})
		setValue(name, value);
	};

	const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValue(name, value, { shouldValidate: true });
	};

	const onRmbMeChange = (e: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
		setValue('rmbMe', data.checked);
	};

	const onSubmit = async (data: { email: string, password: string, rmbMe: undefined | boolean }) => {
		// console.log("[DEBUG] LoginCard rmbMe: " + data.rmbMe)
		setIsLoading(true);
		console.log('email ' + data.email);
		if (data.email && data.password) {
			const userCreds: UserLoginModel = {
				email: data.email,
				password: data.password,
				rmbMe: data.rmbMe === undefined ? false : true
			};
			try {
				await login(userCreds);
				setIsLoading(false);
				navigate('/');
			} catch (err) {
				console.log("[DEBUG] Error logging in!");
				setIsLoading(false);
				setShowError(true);
			}
		}

		// console.log("[DEBUG] Submitted, is user logged in? " + isLoggedIn)
	};
	return (
		<Card.Content>
			<Container className={authModStyles.cardHeader}>
				<Image src="/images/Main_logo.svg" alt="sg decoding logo" />
				<Header as="h1">Welcome Back</Header>
				<small>Sign in to continue</small>
				<div id={authModStyles.blockDivider}></div>
			</Container>
			<Message
				positive
				header="You are Logged Out!"
				content={logoutMsg}
				hidden={logoutMsg === null || showError}
			/>
			<Form
				onSubmit={handleSubmit(onSubmit as any)}
				error={showError}
				noValidate
				role="form"
				aria-label="Login Form"
			>
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
						//defaultValue={rmbMeEmail}
						placeholder='example@ntu.edu.sg'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.email ? { content: errors.email.message } : false}
						role="text"
						aria-label="Email Input"
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						fluid
						label="Password"
						name="password"
						type='password'
						placeholder='Enter your password'
						onChange={onInputChange}
						onBlur={onInputBlur}
						error={errors.password ? { content: errors.password.message } : false}
						role="text"
						aria-label="Password Input"
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
					// fluid
					className={authModStyles.mainActionBtn}
					primary
					icon={isLoading ? "spinner" : undefined}
					loading={isLoading}
					content="Login"
					type='submit'
					role='button'
					aria-label='Login Button'
				/>
			</Form>
			<Link
				to='/auth/forgotpassword'
				id={authModStyles.forgotPasswordLink}
			>
				<em>Forgot your password?</em>
			</Link>
			<br></br>
			{/* <Link to='/auth/resetpassword'><em>Reset Password</em></Link> */}
			<h4>Don't have an account?
				<em><Link to='/auth/register'> Register here</Link></em>
			</h4>
		</Card.Content>);
};

export default LoginPage;