import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Grid, Icon } from "semantic-ui-react";
import { liveDecodeSocket } from "../../api/api";
import { convertToWAVFile, ConvToWavConfig } from "../../helpers/audio-helpers";
import { AdaptationState, AdaptationStateResponse, isHypothesisResponse, LiveDecodeResponse } from "../../models/live-decode-response.model";
import { MyRecorder, RecordingStates, Transcription } from "../../pages/user/live-transcribe.page";
import { RootState } from "../../state/reducers";
import styles from './live-transcribe-btns.module.scss';

// TODO use Redux Store for these props.
interface Props {
	IS_DEBUGGING: boolean,
	transcription: Transcription,
	setTranscription: React.Dispatch<React.SetStateAction<Transcription>>,
	recorder: MyRecorder,
	setRecorder: React.Dispatch<React.SetStateAction<MyRecorder>>,
	webSocketRef: React.MutableRefObject<WebSocket | undefined>,
	allRecordedChunks: Float32Array[],
	selectedLangModel: string
}


const LiveDecodeBtns: React.FC<Props> = (
	{ IS_DEBUGGING, setTranscription, webSocketRef, recorder, setRecorder, allRecordedChunks, selectedLangModel }
) => {
	/* */

	const [webSocketConn, setWebSocketConn] = useState<WebSocket>();

	const [time, setTime] = useState(0);

	const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	const adaptationStateRef = useRef<AdaptationState>();
	adaptationStateRef.current = adaptationState;

	const { token } = useSelector((state: RootState) => state.authReducer);
	/* 
		
	*/
	const onStartClick = () => {
		console.log("[DEBUG] Are you in Debug mode: " + IS_DEBUGGING);
		if (!IS_DEBUGGING) {
			webSocketConn?.close();
			const conn = liveDecodeSocket(token, selectedLangModel);

			conn.onmessage = (event) => {
				console.log("[DEBUG] Received response from gateway");
				console.log(event);
				const { data } = event;
				const response: LiveDecodeResponse = JSON.parse(data);
				if (response.status === 0) {
					if (isHypothesisResponse(response)) {
						console.log('[DEBUG] HYPOTHESIS RESPONSE RECEIVED');
						const { final, hypotheses } = response.result;
						let newTranscription = hypotheses[0].transcript;
						if (final) { // 100% of what the word is
							setTranscription(prev => ({ nonFinal: "", final: [...prev.final, newTranscription] }));
						} else { // not 100% what the word is
							setTranscription(prev => ({ ...prev, nonFinal: "... ..." + newTranscription }));
						}

					} else {
						console.log('[DEBUG] ADAPTATION RESPONSE RECEIVED');
						setAdaptationState((response as AdaptationStateResponse).adaptation_state);
						// webSocketConn?.send(JSON.stringify(adaptationStateRef.current))
					}
				} else if (response.status === 200) {
					console.log("[DEBUG] Successfully connected to the server");
					recorder.audioWorklet!.port.postMessage({ isRecording: RecordingStates.IN_PROGRESS });
					setRecorder({ ...recorder, isRecording: RecordingStates.IN_PROGRESS });
				}
			};

			conn.onopen = (event) => {
				console.log("[DEBUG] Connection to backend opened");
			};

			conn.onerror = (error) => {
				console.error("[ERROR DEBUG] Error with websocket connection");
				console.log(error);
			};

			conn.onclose = (event) => {
				console.log("[DEBUG] onclose");
				console.log(event);
			};

			setWebSocketConn(conn);
			webSocketRef.current = conn;
		} else {
			recorder.audioWorklet!.port.postMessage({ isRecording: RecordingStates.IN_PROGRESS });
			setRecorder({ ...recorder, isRecording: RecordingStates.IN_PROGRESS });
		}
	};

	const onStopClick = () => {
		recorder.audioWorklet!.port.postMessage({ isRecording: RecordingStates.STOPPED });
		setRecorder({ ...recorder, isRecording: RecordingStates.STOPPED });

		if (!IS_DEBUGGING) {
			webSocketConn?.close();
			setWebSocketConn(undefined);
		}
	};

	const onRedoClick = () => {
		window.location.reload();
	};

	const onDownloadClick = () => {
		console.log("[DEBUG] createDownloadLink");
		if (allRecordedChunks.length > 0) {
			const config: ConvToWavConfig = {
				sampleRate: 16000,
				// desiredSampRate: 16000,
				internalInterleavedLength: allRecordedChunks.length * allRecordedChunks[0].length,
				monoChnlBuffer: allRecordedChunks,
			};

			convertToWAVFile(config, function (buffer: any, view: any) {
				var blob = new Blob([buffer], { type: 'audio/x-wav' });
				console.log(blob);

				var url = URL.createObjectURL(blob);
				var anchor = document.createElement('a');
				anchor.style.display = 'none';
				document.body.appendChild(anchor);
				anchor.href = url;
				anchor.download = 'audio.wav';
				anchor.onclick = () => {
					requestAnimationFrame(() => {
						URL.revokeObjectURL(anchor.href);
					});
					document.body.removeChild(anchor);
				};
				anchor.click();
			});
		} else {
			console.error("[ERROR DEBUG] No recording found!");
		}
	};


	/* */
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (recorder.isRecording === RecordingStates.IN_PROGRESS) {
			interval = setInterval(() => {
				// console.log(time);
				setTime(prevTime => prevTime + 1);
			}, 1000);
		}

		return () => {
			console.log("[DEBUG] BtnsArray Unmounted");
			if (interval !== null) {
				console.log("[DEBUG] BtnsArray: Cleared Interval");
				clearInterval(interval);
			}
		};
	}, [recorder.isRecording]);

	return (
		<Container id={styles.recordBtnContainer}>
			{/* <Grid.Row id={styles.langModelDropdown}>
			</Grid.Row> */}
			<Grid.Row>
				{
					recorder.isRecording === RecordingStates.NOT_STARTED
						?
						// <Button icon="circle" fluid primary onClick={onStartClick} content="Start" />
						<Icon.Group size='big' id={styles.recordBtn} onClick={onStartClick}>
							<Icon size='huge' name='circle' />
							<Icon name='microphone' size="large" />
						</Icon.Group>
						:
						recorder.isRecording === RecordingStates.IN_PROGRESS
							?
							// <Button
							// 	icon="stop" fluid secondary onClick={onStopClick}
							// 	content={`Stop (${("0" + Math.floor((time / 3600) % 3600)).slice(-1)}:${("0" + Math.floor((time / 60) % 60)).slice(-2)}:${("0" + Math.floor(time % 60)).slice(-2)})`
							// 	}
							// />
							<Icon.Group size='big' id={styles.stopBtn} onClick={onStopClick}>
								<Icon size='huge' name='circle' />
								<Icon name='stop' />
								<span>{`${("0" + Math.floor((time / 3600) % 3600)).slice(-1)}:${("0" + Math.floor((time / 60) % 60)).slice(-2)}:${("0" + Math.floor(time % 60)).slice(-2)}`}</span>
							</Icon.Group>
							:
							// <Button icon="redo" fluid basic color="orange" onClick={onRedoClick} content="Reset" />
							<Icon.Group size='big' id={styles.redoBtn} onClick={onRedoClick}>
								<Icon size='huge' name='circle outline' color="red" />
								<Icon name='redo' />
							</Icon.Group>
				}
			</Grid.Row>
			<Grid.Row style={{ marginTop: '12px' }}>
				{
					recorder.isRecording === RecordingStates.STOPPED
						?
						<div>
							<Button
								disabled={recorder.isRecording !== RecordingStates.STOPPED}
								// fluid
								color="orange"
								onClick={onDownloadClick}
								icon="cloud download"
								content="Download Recorded Audio"
								style={{marginRight: '12px'}}
							/>
							<Button
								disabled={recorder.isRecording !== RecordingStates.STOPPED}
								// fluid
								color="teal"
								onClick={onDownloadClick}
								icon="download"
								content="Download Transcript (txt)"
							/>
						</div>
						:
						null
				}
			</Grid.Row>

			{/* <Grid.Row>
				<Button className="blue">Test Button</Button>
			</Grid.Row> */}
		</Container>
	);
};

// TODO IMPORTANT
//https://codepen.io/anon/pen/ywJxzV?editors=1111
export default React.memo(LiveDecodeBtns);