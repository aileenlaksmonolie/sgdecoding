import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Grid } from "semantic-ui-react";
import { liveDecodeSocket } from "../../api/api";
import { AdaptationState, AdaptationStateResponse, isHypothesisResponse, LiveDecodeResponse } from "../../models/live-decode-response.model";
import { MyRecorder, RecordingStates, Transcription } from "../../pages/user/LiveDecodePage";
import { RootState } from "../../state/reducers";
import styles from './BtnsArray.module.scss';

interface Props {
	// worker: AudioWorkletNode,
	// onStartCb: Function,
	// onStopCb: Function,
	// webSocketConn: WebSocket
	IS_DEBUGGING: boolean,
	transcription: Transcription,
	setTranscription: React.Dispatch<React.SetStateAction<Transcription>>,
	recorder: MyRecorder,
	setRecorder: React.Dispatch<React.SetStateAction<MyRecorder>>,
	webSocketRef: React.MutableRefObject<WebSocket | undefined>,
}


/*
	Input: setRecorder, audioWorklet.postMessage()
	Output: websocketconn, transcriptObj, 
*/

// const BtnsArray: React.FC<Props> = ({worker, onStartCb, onStopCb}) => {
const BtnsArray: React.FC<Props> = (
	{ IS_DEBUGGING, setTranscription, webSocketRef, recorder, setRecorder }
) => {
	/* */
	const [webSocketConn, setWebSocketConn] = useState<WebSocket>();

	const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	const adaptationStateRef = useRef<AdaptationState>();
	adaptationStateRef.current = adaptationState;

	const { token } = useSelector((state: RootState) => state.authReducer);
	/* 
		
	*/
	const onStartClick = () => {
		console.log("[DEBUG] Are you in Debug mode: " + IS_DEBUGGING)
		if (!IS_DEBUGGING) {
			webSocketConn?.close()
			const conn = liveDecodeSocket(token);

			conn.onmessage = (event) => {
				console.log("[DEBUG] Received response from gateway")
				console.log(event)
				const { data } = event;
				const response: LiveDecodeResponse = JSON.parse(data);
				if (response.status === 0) {
					if (isHypothesisResponse(response)) {
						console.log('[DEBUG] HYPOTHESIS RESPONSE RECEIVED')
						const { final, hypotheses } = response.result
						let newTranscription = hypotheses[0].transcript
						if (final) { // 100% of what the word is
							setTranscription(prev => ({ nonFinal: "", final: [...prev.final, newTranscription] }))
						} else { // not 100% what the word is
							setTranscription(prev => ({ ...prev, nonFinal: "... ..." + newTranscription }))
						}

					} else {
						console.log('[DEBUG] ADAPTATION RESPONSE RECEIVED')
						setAdaptationState((response as AdaptationStateResponse).adaptation_state)
						// webSocketConn?.send(JSON.stringify(adaptationStateRef.current))
					}
				} else if (response.status === 200) {
					console.log("[DEBUG] Successfully connected to the server")
					recorder.audioWorklet!.port.postMessage({ isRecording: true })
					setRecorder({ ...recorder, isRecording: RecordingStates.IN_PROGRESS })
				}
			}

			conn.onopen = (event) => {
				console.log("[DEBUG] Connection to backend opened")
			}

			conn.onerror = (error) => {
				console.error("[ERROR DEBUG] Error with websocket connection")
				console.log(error)
			}

			conn.onclose = (event) => {
				console.log("[DEBUG] onclose")
				console.log(event)
			}

			setWebSocketConn(conn);
			webSocketRef.current = conn;
		} else {
			recorder.audioWorklet!.port.postMessage({ isRecording: true });
			setRecorder({ ...recorder, isRecording: RecordingStates.IN_PROGRESS });
		}
	}

	const onStopClick = () => {
		recorder.audioWorklet!.port.postMessage({ isRecording: false });
		setRecorder({ ...recorder, isRecording: RecordingStates.STOPPED });

		if (!IS_DEBUGGING) {
			webSocketConn?.close();
			setWebSocketConn(undefined);
		}
	}

	const onRedoClick = () => {
		window.location.reload()
	}

	const onDownloadClick = () => {

	}

	/* */


	return (
		<Container id={styles.btnsArrayContainer}>
			<Grid.Row>
				{
					recorder.isRecording === RecordingStates.NOT_STARTED
						?
						<Button icon="circle" fluid primary onClick={onStartClick} content="Start" />
						:
						recorder.isRecording === RecordingStates.IN_PROGRESS
							?
							<Button icon="stop" fluid secondary onClick={onStopClick} content="Stop" />
							:
							<Button icon="redo" fluid basic color="orange" onClick={onRedoClick} content="Redo" />
				}
			</Grid.Row>
			<Grid.Row style={{marginTop: '12px' }}>
				<Button
					disabled={recorder.isRecording !== RecordingStates.STOPPED}
					fluid
					color="green"
					onClick={onDownloadClick}
					icon="cloud download"
					content="Download"
				/>
			</Grid.Row>

			{/* <Grid.Row>
				<Button className="blue">Test Button</Button>
			</Grid.Row> */}
		</Container>
	)
}

export default BtnsArray