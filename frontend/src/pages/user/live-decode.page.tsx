import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Button, ButtonProps, Card, Container, Dropdown, DropdownProps, Grid, Header, Icon, Label } from "semantic-ui-react";
import VizFreqBars from "../../components/audio/freq-bars-visualisation.component";
import LiveDecodeBtns from "../../components/audio/live-decode-btns.component";
import NoMicAccess from "../../components/audio/no-mic-access.component";
import VizOscilloscope from "../../components/audio/oscilloscope-visualisation";
import styles from './live-decode.module.scss';

export enum RecordingStates {
	NOT_STARTED = "notstarted",
	IN_PROGRESS = "inprogress",
	STOPPED = "stopped"
}

export interface MyRecorder {
	isMicAccessGiven: boolean,
	isRecording: RecordingStates,
	stream: MediaStream | null,
	audioContext: AudioContext | null,
	audioWorklet: AudioWorkletNode | null,
	errorMsg: string
}

export interface Transcription {
	final: String[],
	nonFinal: String
}

const languageOptions = [
	{ key: 'eng_closetalk', text: 'English Closetalk', value: 'eng_closetalk' },
	{ key: 'eng_telephony', text: 'English Telephony', value: 'eng_telephony' },
	{ key: 'mandarin_closetalk', text: 'Mandarin Closetalk', value: 'mandarin_closetalk' },
	{ key: 'mandarin_telephony', text: 'Mandarin Telephony', value: 'mandarin_telephony' },
	{ key: 'malay_closetalk', text: 'Malay Closetalk', value: 'malay_closetalk' },
	{ key: 'engmalay_closetalk', text: 'English-Malay Closetalk', value: 'engmalay_closetalk' },
	{ key: 'cs_closetalk', text: 'Code Switch Closetalk', value: 'cs_closetalk' },
	{ key: 'cs_telephony', text: 'Code Switch Telephony', value: 'cs_telephony' },
];


const LiveDecodePage: React.FC = () => {
	/* Declarations */
	const IS_DEBUGGING: boolean = false;

	const [recorder, setRecorder] = useState<MyRecorder>({
		isMicAccessGiven: false,
		stream: null,
		isRecording: RecordingStates.NOT_STARTED,
		audioContext: null,
		audioWorklet: null,
		errorMsg: '',
	});
	const recorderRef = useRef<MyRecorder>();
	recorderRef.current = recorder;

	const location = useLocation();

	// const [webSocketConn, setWebSocketConn] = useState<WebSocket>();
	const webSocketConnRef = useRef<WebSocket>();
	// webSocketConnRef.current = webSocketConn;

	// const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	// const adaptationStateRef = useRef<AdaptationState>();
	// adaptationStateRef.current = adaptationState;

	const [transcription, setTranscription] =
		useState<Transcription>({
			final: [],
			nonFinal: ""
		});

	const [allRecordedChunks, setAllRecordedChunks] = useState<Float32Array[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [showChangeVizOverlay, setShowChangeVizOverlay] = useState(false);
	const [selectedViz, setSelectedViz] = useState("Oscilloscope");
	const [selectedLangModel, setSelectedLangModel] = useState<string>("eng_closetalk");

	const reqMicrophoneAccess = async (): Promise<MediaStream> => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { // Shorthand to write MediaTrackConstraints
				sampleRate: 48000, // Changing to 16k does nothing because browser capability is limited to min 48k
				sampleSize: 16,		 // 16-bits
				channelCount: 1, 	 // mono
				// noiseSuppression: true,
				echoCancellation: true
			},
			video: false
		});
		// console.log("stream.getAudioTracks()[0].getCapabilities():")
		// console.log(stream.getAudioTracks()[0].getCapabilities());
		return stream;
	};

	const createAudioContext = (stream: MediaStream) => {
		/* sampleRate property is not implemented in Firefox yet. Only Chrome. 
					Have to downsample manually.*/
		// var audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 16000})
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		return audioContext;
	};

	/* 
		Worklet files must be placed in /public directory in React project 
		as addModule() looks for them in there
	*/
	const loadWorkletNode = useCallback(async (audioCtx: AudioContext, stream: MediaStream) => {
		await audioCtx.audioWorklet.addModule('worklet/audio-worklet.js');
		const source: MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(stream);
		const audioWorklet = new AudioWorkletNode(audioCtx, 'audio-processor', { outputChannelCount: [1] });
		source.connect(audioWorklet);

		audioWorklet.port.onmessage = async (event) => {
			// console.log(" ")
			// console.log("[DEBUG] WORKER onmessage")
			// console.log(event.data)
			const { frame16Int, frame32FloatDownsampled } = event.data;

			// console.log(recorderRef.current?.isRecording);
			if (recorderRef.current?.isRecording === RecordingStates.IN_PROGRESS) {
				if (!IS_DEBUGGING && webSocketConnRef.current) {
					// if (adaptationStateRef.current) {
					// 	console.log("[DEBUG] Sent adaptation state")
					// 	webSocketConnRef.current.send(JSON.stringify(adaptationStateRef.current))
					// }
					var blob = new Blob([frame16Int], { type: 'audio/x-raw' });
					webSocketConnRef.current.send(blob);
					// console.log("[DEBUG] Sent WAV blob to backend");
				}
			} else if (recorderRef.current?.isRecording === RecordingStates.STOPPED) {
				// TODO save into store
				setAllRecordedChunks(frame32FloatDownsampled);
			}

			// console.log(" ");
		}; // END onmessage;

		audioWorklet.port.start();
		return audioWorklet;
	}, [IS_DEBUGGING]);

	const confirmNavAway = (e: BeforeUnloadEvent) => {
		e.preventDefault();
		// console.log(recorderRef.current?.isRecording)
		if (recorderRef.current?.isRecording !== RecordingStates.NOT_STARTED)
			e.returnValue = "";
	};

	const onSelLanguageModelChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const { value } = data;
		console.log("[DEBUG] changed lang model: " + value);
		if (value && value !== '') {
			setSelectedLangModel(value as string);
		}
	};

	const onVizCogClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
		setShowChangeVizOverlay(!showChangeVizOverlay);
		console.log(showChangeVizOverlay);
	};

	const onChangeVizBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
		console.log(data);
		if (data.children)
			setSelectedViz(data.children.toString());
		setShowChangeVizOverlay(false);
	};

	useEffect(() => {
		// if(recorder.isRecording === RecordingStates.IN_PROGRESS)
		console.log(location);
		// 	window.confirm("are you sure?")
	}, [location]);

	useEffect(() => {
		/*	
			Workaround to prevent NoMicAccess from "blinking"
			Ideally, we want to use Permissions API to check 'microphone' permissions beforehand
			to know which state to present. However, as of now available only in Chrome but not in Firefox.
		*/
		setTimeout(() => {
			setIsLoading(false);
		}, 750);

		reqMicrophoneAccess()
			.then((stream) => {
				const audioContext = createAudioContext(stream);
				console.log(stream);
				loadWorkletNode(audioContext, stream).then(
					(audioWorklet) => {
						setRecorder(r => ({ ...r, isMicAccessGiven: true, stream, audioContext, audioWorklet }));
					});
			}).catch(
				(error) => {
					console.error(`Error code: ${error.code}, Message: ${error.message}`);
					let msg = error.name === "NotAllowedError" ? 'You have denied giving microphone permissions' :
						'Something went terribly wrong, pleae contact an administrator!';
					setRecorder(r => ({ ...r, isMicAccessGiven: false, errorMsg: msg }));
				});

		/* 
			Workaround as usePrompt/useBlocker is not yet available in React Router v6 
			as of writing, Jan 2021. Ref: https://github.com/remix-run/react-router/issues/8139
			TODO https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743
		*/
		window.addEventListener('beforeunload', confirmNavAway);

		return () => {
			console.log("[DEBUG] Live Decode Page unmounted");
			// console.log(recorder.stream);
			// console.log(recorderRef.current);
			if (recorderRef.current) {
				recorderRef.current.audioContext?.close();
				recorderRef.current.stream?.getTracks().forEach(track => track.stop());
			}
			// recorder.stream!.getAudioTracks()[0].enabled = false;
			window.removeEventListener('beforeunload', confirmNavAway);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadWorkletNode]);


	if (isLoading)
		return <Container></Container>;
	if (recorder.isMicAccessGiven === false)
		return (
			<div style={{ textAlign: 'center' }}>
				<NoMicAccess errorMsg={recorder.errorMsg ? recorder.errorMsg : ''} />
			</div>
		);
	else
		return (
			<div id={styles.livePgContainer}>
				<div id={styles.headerContainer}>
					<Header as="h1">Live Transcribe</Header>
					<p>Live decoding transcribes your speech into text as you speak into the microphone. Click the start button to begin decoding!</p>
				</div>
				<Card
					// color={recorder.isRecording === RecordingStates.IN_PROGRESS ? "green" : "purple"}
					fluid
					id={styles.livePgCard}
				>
					{/* Top Label saying "Ready to Record"/"Recording"/"Stopped" */}
					{
						recorder.isRecording === RecordingStates.NOT_STARTED
							?
							<Label id={styles.readyToRecordState} className={styles.recordingStateLbl}>
								<Icon name="info circle" />
								Ready to Record
							</Label>
							:
							recorder.isRecording === RecordingStates.IN_PROGRESS
								?
								<Label id={styles.inProgressState} className={styles.recordingStateLbl}>
									<Icon loading name="stop circle" />
									<span>Recording</span>
									<span></span>
								</Label>
								:
								<Label id={styles.finishedState} className={`${styles.recordingStateLbl} green`}>
									<Icon name="stop circle outline" />
									<span>Finished</span>
									<span></span>
								</Label>
					}
					<Card.Content>
						{
							showChangeVizOverlay
								?
								<Icon name='close' id={styles.vizCogClose} size="large" onClick={onVizCogClick} />
								:
								<Icon name='cog' id={styles.vizCog} size="large" onClick={onVizCogClick} />
						}
						<div id={styles.changeVizBtns} className={showChangeVizOverlay ? styles.showVizOverlay : styles.hideVizOverlay}>						<Button.Group inverted size="large">
							<Button
								onClick={onChangeVizBtnClick}
								primary={selectedViz === 'Frequency Bars'}
							>
								Frequency Bars
							</Button>

							<Button.Or />

							<Button
								primary={selectedViz === 'Oscilloscope'}
								onClick={onChangeVizBtnClick}
							>
								Oscilloscope
							</Button>
						</Button.Group>
						</div>

						<Grid padded>
							<Grid.Row id={styles.selLangModelContainer}>
								<label style={{ lineHeight: '38px', marginRight: '12px' }}>
									<strong>Select Language Model: </strong>
								</label>
								<Dropdown
									scrolling
									labeled
									placeholder='Language Model'
									// fluid
									selection
									defaultValue={"eng_closetalk"}
									options={languageOptions}
									onChange={onSelLanguageModelChange}
									disabled={recorder.isRecording === RecordingStates.IN_PROGRESS
										|| recorder.isRecording === RecordingStates.STOPPED}
								/>
							</Grid.Row>

							<Grid.Row style={{zIndex: '2'}}>
								{/* <Grid.Column> */}
								{/* <Segment
										padded
										color={recorder.isRecording === RecordingStates.IN_PROGRESS ? "green" : "purple"}
										style={{ minHeight: '200px', textAlign: 'left', background: '#fdfdfd' }}
									> */}
								<Container id={styles.transcriptArea}>
									{
										recorder.isRecording === RecordingStates.NOT_STARTED
											?
											"Press \"Start\" to begin..."
											:
											transcription.final.join(" ").toString() + transcription.nonFinal.toString()
									}
								</Container>
								{/* </Segment> */}
								{/* </Grid.Column> */}
							</Grid.Row>

							<Grid.Row>
								{/* <Grid.Column width={16}> */}
								<div id={styles.visualisationContainer}>
									{
										selectedViz === 'Oscilloscope'
											?
											<VizOscilloscope recorder={recorder} />
											:
											<VizFreqBars recorder={recorder} />
									}

								</div>
								{/* </Grid.Column> */}
							</Grid.Row>
							<Grid.Row id={styles.startBtn}>
								<LiveDecodeBtns
									// key={transcription.final.length}
									IS_DEBUGGING={IS_DEBUGGING}
									recorder={recorder}
									setRecorder={setRecorder}
									transcription={transcription}
									setTranscription={setTranscription}
									webSocketRef={webSocketConnRef}
									allRecordedChunks={allRecordedChunks}
									selectedLangModel={selectedLangModel}
								/>
							</Grid.Row>

							{/* Debug */}
							{/* <Grid.Row> */}
							{/* {showDownload.show && <a href={showDownload.url} download="audio.wav">Download Test</a>} */}
							{/* <a onClick={createDownloadLink}>Download Test</a>
							</Grid.Row> */}
						</Grid>
					</Card.Content>
				</Card>
			</div>
		);
};

export default LiveDecodePage;