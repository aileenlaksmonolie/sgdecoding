import React from "react";
import { Button, Card, Container, Header } from "semantic-ui-react";
import styles from './offline-transcribe-page.module.scss';
import ModalUploadFile from '../../components/audio/upload-file-modal';


const OfflineTranscribePage: React.FC = () => {


	// template
	return (
		<Container id={styles.offlineTranscribePg}>
			<Card fluid id={styles.introSection}>
				<Card.Description textAlign="center">
					<Container text>
						<Header textAlign="center" as="h1">Offline Transcribe</Header>
						<p>
							In offline transcribing, you may upload local audio files and our servers will
							generate the text for you. The time taken for the transcription process depends
							on the length of audio file.
						</p>
						{/* <Button color="teal">Upload Audio Files / Record Now</Button> */}
						<ModalUploadFile>Upload Audio Files</ModalUploadFile>
					</Container>
				</Card.Description>
			</Card>

			
		</Container>
	);
};

export default OfflineTranscribePage;