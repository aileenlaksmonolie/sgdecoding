import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Card, Container, Header, Icon, List, Pagination } from "semantic-ui-react";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './offline-transcribe-page.module.scss';

const OfflineTranscribePage: React.FC = () => {

	const { email } = useSelector((state: RootState) => state.authReducer)
	const { history, totalHistory} = useSelector((state: RootState) => state.transcriptionHistoryReducer)

	const dispatch = useDispatch();
	const { getLoggedInUserTranscriptionHistory } = bindActionCreators(actionCreators, dispatch)

	useEffect(() => {
		getLoggedInUserTranscriptionHistory()
	}, []);

	useEffect(() => {
		console.log(history)
	}, [history])

	return (
		<Container id={styles.offlineTranscribePg}>
			<p>Offline transcribe page works!</p>
			<Card fluid >
				<Header textAlign="center" as="h1">Offline Transcribe</Header>
				<Card.Description textAlign="center">
					<p>
						In offline transcribing, you may upload local audio files and our servers will
						generate the text for you. The time taken for the transcription process depends
						on the length of audio file.
					</p>
					<Button color="teal">Upload Audio Files / Record Now</Button>
				</Card.Description>
			</Card>

			<Header as="h2">View Previous Transcription Jobs</Header>
			<List divided size="large" verticalAlign="middle">
				<List.Item>
					<List.Content floated='right' className={styles.listItemBtns}>
						<Button>View</Button>
						<Button>Download</Button>
						<Button>Delete</Button>
					</List.Content>
					<List.Icon name='github' size='huge' />
					{/* <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' /> */}
					<List.Content>
						<List.Header as='a'>Semantic-Org/Semantic-UI</List.Header>
						<List.Description as='a'>Updated 10 mins ago</List.Description>
					</List.Content>
				</List.Item>

			</List>
			<Pagination
				defaultActivePage={5}
				ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
				firstItem={{ content: <Icon name='angle double left' />, icon: true }}
				lastItem={{ content: <Icon name='angle double right' />, icon: true }}
				prevItem={{ content: <Icon name='angle left' />, icon: true }}
				nextItem={{ content: <Icon name='angle right' />, icon: true }}
				totalPages={10}
			/>
		</Container>
	);
}

export default React.memo(OfflineTranscribePage);