import React from "react";
import { Container, Header } from "semantic-ui-react";
import styles from './offline-transcribe-page.module.scss';


const OfflineTranscribePage: React.FC = () => {


	// template
	return (
		<div id={styles.offlineTranscribePg}>
			<Container text textAlign="center" id={styles.headerContainer}>
				<Header as="h1">Offline Transcribe</Header>
				<p>
					In offline transcribing, you may upload local audio files and our servers will
					generate the text for you. The time taken for the transcription process depends
					on the length of audio file.
				</p>
			</Container>

			{/* <Card fluid>
				<Card.Description textAlign="center">
					<Container text>
						<Header textAlign="center" as="h1">Offline Transcribe</Header>
						<p>
							In offline transcribing, you may upload local audio files and our servers will
							generate the text for you. The time taken for the transcription process depends
							on the length of audio file.
						</p> */}
			{/* <Button color="teal">Upload Audio Files / Record Now</Button> */}
			{/* <ModalUploadFile>Upload Audio Files</ModalUploadFile>
					</Container>
				</Card.Description> */}
			{/* </Card> */}


		</div>
	);
};

export default OfflineTranscribePage;