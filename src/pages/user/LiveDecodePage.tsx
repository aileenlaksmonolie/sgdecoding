import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, Container, Grid, TextArea } from "semantic-ui-react";
import BtnsArray from "../../components/audio/BtnsArray";
import NoMicAccess from "../../components/audio/NoMicAccess";
import VizFreqBars from "../../components/audio/VizFreqBars";
import { convertToWAVFile, ConvToWavConfig } from "../../helpers/audio-helpers";
import styles from './LiveDecodePage.module.scss';

export enum RecordingStates{
	NOT_STARTED="notstarted",
	INPROGRESS="inprogress",
	STOPPED="stopped"
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

const LiveDecodePage: React.FC = () => {
	/* Declarations */
	const IS_DEBUGGING: boolean = true;

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

	// const [webSocketConn, setWebSocketConn] = useState<WebSocket>();
	const webSocketConnRef = useRef<WebSocket>();
	// webSocketConnRef.current = webSocketConn;

	// const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	// const adaptationStateRef = useRef<AdaptationState>();
	// adaptationStateRef.current = adaptationState;

	// TODO combine these 2 into 1
	const [transcription, setTranscription] =
		useState<Transcription>({
			final: [],
			nonFinal: ""
		});

	const [allRecordedChunks, setAllRecordedChunks] = useState<Float32Array[]>([]);
	const allRecordedChunksRef = useRef<Array<Float32Array>>();
	allRecordedChunksRef.current = allRecordedChunks;

	const [isLoading, setIsLoading] = useState(true);


	const reqMicrophoneAccess = async (): Promise<MediaStream> => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { // Shorthand to write MediaTrackConstraints
				sampleRate: 48000, // Changing to 16k does nothing because browser capability is limited to min 48k
				sampleSize: 16,		 // 16-bits
				channelCount: 1, 	 // mono
				noiseSuppression: true,
				echoCancellation: true
			},
			video: false
		})
		// console.log("stream.getAudioTracks()[0].getCapabilities():")
		// console.log(stream.getAudioTracks()[0].getCapabilities());
		return stream
	}

	const createAudioContext = (stream: MediaStream) => {
		/* sampleRate property is not implemented in Firefox yet. Only Chrome. 
					Have to downsample manually.*/
		// var audioCtx = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 16000})
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		return audioContext
	}

	/* 
		Worklet files must be placed in /public directory in React project 
		as addModule() looks for them in there
	*/
	const loadWorkletNode = useCallback(async (audioCtx: AudioContext, stream: MediaStream) => {
		await audioCtx.audioWorklet.addModule('worklet/audio-worklet.js');
		const source: MediaStreamAudioSourceNode = audioCtx.createMediaStreamSource(stream)
		const audioWorklet = new AudioWorkletNode(audioCtx, 'buffer-detector', { outputChannelCount: [1] })
		source.connect(audioWorklet)

		audioWorklet.port.onmessage = async (event) => {
			// console.log(" ")
			// console.log("[DEBUG] WORKER onmessage")
			// console.log(event.data)
			const { frame16Int, frame32FloatDownsampled } = event.data

			// console.log(recorderRef.current?.isRecording);
			if (recorderRef.current?.isRecording === RecordingStates.INPROGRESS) {
				if (!IS_DEBUGGING && webSocketConnRef.current) {
					// if (adaptationStateRef.current) {
					// 	console.log("[DEBUG] Sent adaptation state")
					// 	webSocketConnRef.current.send(JSON.stringify(adaptationStateRef.current))
					// }
					var blob = new Blob([frame16Int], { type: 'audio/x-raw' });
					webSocketConnRef.current.send(blob);
					// console.log("[DEBUG] Sent WAV blob to backend");
				}
			} else {
				setAllRecordedChunks(frame32FloatDownsampled);
			}

			// console.log(" ");
		} // END onmessage

		audioWorklet.port.start();
		return audioWorklet;
	}, [IS_DEBUGGING]);


	const createDownloadLink = () => {
		console.log("[DEBUG] createDownloadLink")
		if (allRecordedChunks.length > 0) {
			const config: ConvToWavConfig = {
				sampleRate: 16000,
				// desiredSampRate: 16000,
				internalInterleavedLength: allRecordedChunks.length * allRecordedChunks[0].length,
				monoChnlBuffer: allRecordedChunks,
			}

			convertToWAVFile(config, function (buffer: any, view: any) {
				var blob = new Blob([buffer], { type: 'audio/x-wav' });
				console.log(blob)

				var url = URL.createObjectURL(blob);
				var anchor = document.createElement('a')
				anchor.style.display = 'none'
				document.body.appendChild(anchor)
				anchor.href = url
				anchor.download = 'audio.wav'
				anchor.onclick = () => {
					requestAnimationFrame(() => {
						URL.revokeObjectURL(anchor.href)
					});
					document.body.removeChild(anchor)
				}
				anchor.click()
			})
		} else {
			console.error("[ERROR DEBUG] No recording found!")
		}

	}


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
				loadWorkletNode(audioContext, stream).then(
					(audioWorklet) => {
						setRecorder(r => ({ ...r, isMicAccessGiven: true, stream, audioContext, audioWorklet }))
					});
			}).catch(
				(error) => {
					console.error(`Error code: ${error.code}, Message: ${error.message}`);
					let msg = error.name === "NotAllowedError" ? 'You have denied giving microphone permissions' :
						'Something went terribly wrong, pleae contact an administrator!'
					setRecorder(r => ({ ...r, isMicAccessGiven: false, errorMsg: msg }))
				});

		return () => {
			recorder.audioContext?.close()
		}

	}, [loadWorkletNode])

	if (isLoading)
		return <Container></Container>
	if (recorder.isMicAccessGiven === false)
		return (
			<Container textAlign="center">
				<NoMicAccess errorMsg={recorder.errorMsg ? recorder.errorMsg : ''} />
			</Container>
		);
	else
		return (
			<Container id={styles.livePgContainer} textAlign="center">
				<h1>Live Transcribe</h1>
				<p>Live decoding transcribes your speech into text as you speak into the microphone. Click the start button to begin decoding!</p>
				<Card fluid>
					<Card.Content>
						<Grid padded>
							<Grid.Row>
								<Grid.Column width={3}>
									<BtnsArray 
										key={transcription.final.length}
										IS_DEBUGGING={IS_DEBUGGING}
										recorder={recorder}
										setRecorder={setRecorder}
										transcription={transcription }
										setTranscription={setTranscription}
										webSocketRef={webSocketConnRef}
										/>
								</Grid.Column>
								<Grid.Column width={13}>
									{/* <VizSineWave stream={recorder.stream} /> */}
									{
										recorder.isMicAccessGiven && recorder.audioContext && recorder.stream ?
											<VizFreqBars recorder={recorder} /> :
											<p>Loading Stream....</p>
									}
								</Grid.Column>
							</Grid.Row>

							<Grid.Row>
								<Grid.Column>
									<TextArea
										placeholder='Press "Start" to begin ...'
										rows={8}
										style={{ minHeight: '200px', minWidth: '100%', padding: '16px' }}
										disabled
										value={transcription.final.join(" ").toString() + transcription.nonFinal.toString()}
									/>
								</Grid.Column>
							</Grid.Row>
							{/* Debug */}
							<Grid.Row>
								{/* {showDownload.show && <a href={showDownload.url} download="audio.wav">Download Test</a>} */}
								<a onClick={createDownloadLink}>Download Test</a>
							</Grid.Row>
						</Grid>
					</Card.Content>
				</Card>
			</Container >
		);
}

export default React.memo(LiveDecodePage)