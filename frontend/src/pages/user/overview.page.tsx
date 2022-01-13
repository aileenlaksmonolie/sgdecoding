import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Button, Card, Container, Grid, Header, Icon, Image, Statistic } from 'semantic-ui-react';
import { RootState } from '../../state/reducers';
import styles from './overview.page.module.scss';

const OverviewPage: React.FC = () => {

	/* For Development */
	const data01 = [
		{
			"name": "Total Remaining",
			"value": 400
		},
		{
			"name": "Used This Month",
			"value": 300
		}
	];
	const COLORS_LIVE = [
		"#2DB84B", "#643CC6"
	];
	const COLORS_OFFLINE = [
		"#0CB5AC", "#F0171C"
	];
	/* END: For Development */
	const { name } = useSelector((state: RootState) => state.authReducer);

	const currentTime: number = Number(moment(new Date().getTime()).format("HH"));

	return (<Container>
		<section id={styles.welcomeSection}>
			<Header as="h1">
				{
					currentTime < 12
						?
						"Good Morning, "
						:
						currentTime >= 12 && currentTime < 18
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
							<Image src="/images/HeaderImg_male.svg" alt="header image male" />
						</Grid.Column>
					</Grid>
				</Card.Content>
			</Card>
		</section>

		<section id={styles.overviewSection}>
			<Header as="h2">Overview</Header>
			<Card.Group itemsPerRow={4} id={styles.overviewCardGroup}>
				{/* First Card: */}
				<Card>
					<Card.Content className={styles.overviewCardContent}>
						<Icon.Group size='huge' className={styles.purpIcon}>
							<Icon size='big' name='circle' />
							<Icon name='clipboard check' />
						</Icon.Group>
						<Statistic size="tiny">
							<Statistic.Value>10</Statistic.Value>
							<Statistic.Label>Jobs in Total</Statistic.Label>
						</Statistic>
					</Card.Content>
				</Card>
				{/* Second Card:  */}
				<Card>
					<Card.Content className={styles.overviewCardContent}>
						<Icon.Group size='huge' className={styles.blueIcon}>
							<Icon size='big' name='circle' />
							<Icon name='hourglass half' />
						</Icon.Group>
						<Statistic size="tiny">
							<Statistic.Value>4</Statistic.Value>
							<Statistic.Label>Pending Jobs</Statistic.Label>
						</Statistic>
					</Card.Content>
				</Card>
				{/* Third Card:  */}
				<Card>
					<Card.Content className={styles.overviewCardContent}>
						<Icon.Group size='huge' className={styles.redIcon}>
							<Icon size='big' name='circle' />
							<Icon name='clock' />
						</Icon.Group>
						<Statistic size="tiny">
							<Statistic.Value>55 hrs</Statistic.Value>
							<Statistic.Label>Transcribed</Statistic.Label>
						</Statistic>
					</Card.Content>
				</Card>
			</Card.Group>
		</section>


		<section id={styles.monthlyUsageStats}>
			<Header as="h2">Usage Statistics for {moment(new Date()).format("MMM")} {moment(new Date()).format("YYYY")}</Header>
			<Card.Group itemsPerRow={2} stackable>
				<Card>
					<Card.Content>
						<Card.Header>
							Live Transcribe (in Minutes)
						</Card.Header>
					</Card.Content>
					<Card.Content>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#fffaaa" label>
									{
										data01.map((entry, index) => <Cell key={index} fill={COLORS_OFFLINE[index % COLORS_OFFLINE.length]} />)
									}
								</Pie>
								<Legend verticalAlign="top" height={36} />
							</PieChart>
						</ResponsiveContainer>
					</Card.Content>
				</Card>
				{/* Offline Transcribe Card */}
				<Card>
					<Card.Content>
						<Card.Header>
							Offline Transcribe (in Minutes)
						</Card.Header>
					</Card.Content>
					<Card.Content>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie data={data01} dataKey="value" nameKey="name" cx="50%" cy="56%" innerRadius={60} outerRadius={80} fill="#8884d8" label>
									{
										data01.map((entry, index) => <Cell key={index} fill={COLORS_LIVE[index % COLORS_LIVE.length]} />)
									}
								</Pie>
								<Legend verticalAlign="top" height={36} />
							</PieChart>
						</ResponsiveContainer>
					</Card.Content>
				</Card>
			</Card.Group>
		</section>

		{/* <span>Logged In Successfully</span>
		<button onClick={logout}>Logout</button> */}
	</Container>);
};

export default OverviewPage;