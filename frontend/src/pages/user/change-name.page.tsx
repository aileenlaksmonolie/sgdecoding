import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Button, Card, Container, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import { UserChangeName } from '../../models/user-authentication.model';
import { actionCreators } from '../../state';
import { RootState } from '../../state/reducers';


const ChangeNamePage: React.FC = () => {
	/* Declarations */
	const [formMessage, setFormMessage] = useState({ isShown: false, isError: false, msg: '' });
	const [isDisabled, setIsDiabled] = useState(false);

	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm({ mode: 'onBlur' });

	const { token } = useSelector((state: RootState) => state.authReducer);
	const isLoggedIn = token !== '';
	const dispatch = useDispatch();
	const { changeName } = bindActionCreators(actionCreators, dispatch);

	useEffect(() => {
		register("newName", {
			required: 'New Name field is empty!',
		});

		if (!isLoggedIn)
			navigate('/');

	}, [isLoggedIn, navigate, register]);

	/* Event Handlers */
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		// setValue(name, value, { shouldValidate: true})
		setValue(name, value);
	};

	const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValue(name, value, { shouldValidate: true });
	};

	const onSubmit = async (data: { newName: string }) => {
		// console.log("[DEBUG] onSubmit: ")
		// console.log(data)
		const newNameRequest: UserChangeName = {
            token: token,
			newName: data.newName,
		};

		try{
			await changeName(newNameRequest);
			setFormMessage({ isShown: true, isError: false, msg: "Your name has been successfully changed!" });
		}catch(error){
			setFormMessage({ isShown: true, isError: true, msg: "Unfortunately, there was an error resetting your name!" });
		}

		// sendChangeNameRequest(newNameRequest)
		// 	.then((res: AxiosResponse<UserChangeNameResponse, any>) => {
		// 		// console.log("[DEBUG] Successful Reset") 

		// 	})
		// 	.catch((err: AxiosError) => {
		// 		// console.log("[DEBUG] Error Resetting!")
		// 		// console.log(err.response)
		// 	});
	};

	return (
		<Card.Content>
			<Container>
				<h1>Change Name</h1>
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
					header= {formMessage.isError ? 'Change Name Unsuccessful' : 'Change Name Successful'}
					content={formMessage.msg}
				/>
				<Form.Field>
					<Form.Input
						fluid
						label="New Name"
						name="newName"
						type='text'
						placeholder='Enter New Name'
						onChange={onInputChange}
						onBlur={onInputBlur}
						disabled={isDisabled}
						error={errors.newName ? { content: errors.newName.message } : false}
					/>
				</Form.Field>
				
				<Button
					//className={classes.registerBtn}
					fluid
					primary
					type='submit'>
					Change My Name
				</Button>

				<Button
					//className={classes.goBackBtn}
					fluid
					basic
					onClick={() => navigate(-1)}>
					Go Back
				</Button>

			</Form>
			
		</Card.Content>
		
	);
};

export default React.memo(ChangeNamePage);