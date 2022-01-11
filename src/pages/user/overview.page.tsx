import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Grid, Header, Image } from 'semantic-ui-react';
import { RootState } from '../../state/reducers';
import styles from './overview.page.module.scss';

const OverviewPage: React.FC = () => {

	// const dispatch = useDispatch();
	// const { logout } = bindActionCreators(actionCreators, dispatch)
	const { name } = useSelector((state: RootState) => state.authReducer)

	const currentTime: number = Number(moment(new Date().getTime()).format("HH"));

	return (<Container>
		<Header as="h1" id={styles.greetingsHeader}>
			{
				currentTime < 12
					?
					"Good Morning, "
					:
					currentTime > 12 && currentTime < 18
						?
						"Good Afternoon, "
						:
						"Good Evening, "
			}
			<span>{name}</span>
		</Header>

		<Card fluid id={styles.welcomeCard}>
			<Card.Content>
				<Grid columns={2} padded>
					<Grid.Column id={styles.welcomeTextWrapper}>
						<Card.Header as="h3">
							Welcome Back to SG Decoding!
						</Card.Header>
						<p>You last logged in at &lt; TO BE DONE &gt; Click on any of the following when you are ready to start transcribing with us.</p>
						<Button as={Link} to="/livetranscribe" primary>Live Transcribe</Button>
						<Button as={Link} to="/offlinetranscribe" color="orange">Offline Transcribe</Button>
					</Grid.Column>

					<Grid.Column>
						<Image src="./images/HeaderImg_male.svg" alt="header image male" />
					</Grid.Column>
				</Grid>
			</Card.Content>

		</Card>

		{/* <span>Logged In Successfully</span>
		<button onClick={logout}>Logout</button> */}
	</Container>)
}

export default OverviewPage;