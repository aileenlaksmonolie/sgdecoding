import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Container, Grid, TextArea } from "semantic-ui-react";
import { liveDecodeSocket } from "../../api/api";
import BtnsArray from "../../components/audio/BtnsArray";
import NoMicAccess from "../../components/audio/NoMicAccess";
import VizFreqBars from "../../components/audio/VizFreqBars";
import { AdaptationState, AdaptationStateResponse, isHypothesisResponse, LiveDecodeResponse } from "../../models/live-decode-response.model";
import { RootState } from "../../state/reducers";

const toWav = require('audiobuffer-to-wav');

export interface Recorder {
	hasAccess: boolean,
	stream: MediaStream | any,
	instance: MediaRecorder | any,
	errorMsg: string
}

const LiveDecodePage: React.FC = () => {
	/*  */
	const { token } = useSelector((state: RootState) => state.authReducer);
	const [webSocket, setWebSocket] = useState<WebSocket>();
	const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	const [finalTranscription, setFinalTranscription] = useState<String[]>([]);
	const [nonFinalTranscription, setNonFinalTranscription] = useState<String>('');
	const interval = useRef<NodeJS.Timeout>();

	const [isLoading, setIsLoading] = useState(true);
	const [recorder, setRecorder] = useState<Recorder>({
		hasAccess: false,
		stream: null,
		instance: null,
		errorMsg: ""
	});

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
	const fileReader = new FileReader();
	const [downloadLink, setDownloadLink] = useState({ show: false, blob: new Blob() });

	// For callbacks
	const downloadLinkRef = useRef<{show: boolean, blob: Blob}>(); // TODO unnecessary now?
	downloadLinkRef.current = downloadLink;
	const webSocketRef = useRef<WebSocket>();
	webSocketRef.current = webSocket;

	fileReader.onloadend = (e:ProgressEvent<FileReader>) => {
		const arrayBuffer = fileReader.result as ArrayBuffer

		// Convert array buffer into audio buffer
		audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
			console.log(audioBuffer);
			var test = toWav(audioBuffer);
			var blob = new Blob([new DataView(test)], {
				type: 'audio/wav'
			});

			// console.log('show downlink link?: ' + downloadLinkRef.current?.show)
			// if(downloadLinkRef.current?.show === true)
			// 	setDownloadLink({ ...downloadLink, blob });
			// else{
				console.log("[DEBUG] Sent to WS server?") 
			webSocketRef.current?.send(blob)
			// }
			// console.log(url)
		})
	}

	/* */

	const createDownloadLink = () => {
		var url = URL.createObjectURL(downloadLink.blob);
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
		// window.URL.revokeObjectURL(url)
	}

	const reqMicrophoneAccess = async () => {
		let allRecordedChunks: Blob[] = []
		let currentChunk: Blob[] = []
		let blobForServer
		let arrayBuffer: ArrayBuffer

		try {
			let stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

			const recorderOptions: MediaRecorderOptions = {
				mimeType: 'audio/webm',
				audioBitsPerSecond: 128000 //
			}
			let mediaRecorder: MediaRecorder = new MediaRecorder(stream, recorderOptions);
			// let mediaRecorder: MediaRecorder = new MediaRecorder(stream);

			console.log("[DEBUG] audio bit rate: " + mediaRecorder.audioBitsPerSecond);
			console.log("[DEBUG] mimeType: " + mediaRecorder.mimeType);

			mediaRecorder.addEventListener('dataavailable', async ({data}) => {
				console.log('[DEBUG] mediaRecorder dataavailable');
				currentChunk = []
				if (data.size > 0){
					allRecordedChunks.push(data);
					currentChunk.push(data)
					console.log(currentChunk)
					blobForServer = new Blob(currentChunk);
					arrayBuffer = await blobForServer.arrayBuffer()
					audioCtx.decodeAudioData(arrayBuffer, (audioBuffer) => {
						console.log(audioBuffer);
						var test = toWav(audioBuffer);
						var blob = new Blob([new DataView(test)], {
							type: 'audio/wav'
						});
						console.log("[DEBUG] Sent to WS server?") 
						webSocketRef.current?.send(blob)
					})
				}
				// console.log(recordedChunks)
			});

			mediaRecorder.addEventListener('stop', async () => {
				console.log('[DEBUG] media recorder stopped');
				console.log(allRecordedChunks);
				// TODO fix this, cannot reuse some FileReader instance
				// var testBlob = new Blob(allRecordedChunks);
				// fileReader.readAsArrayBuffer(testBlob);
				// setDownloadLink({...downloadLink, show: true});
			});

			setRecorder({ hasAccess: true, stream, instance: mediaRecorder, errorMsg: "" });
		} catch (error: any) { // User didn't give permission
			console.error(`Error code: ${error.code}, Message: ${error.message}`);
			let msg = error.name === "NotAllowedError" ? 'You have denied giving microphone permissions' :
				'Something went terribly wrong, pleae contact an administrator!'
			setRecorder({ ...recorder, hasAccess: false, errorMsg: msg });
		}
	}

	const onStartClick = () => {
		recorder.instance.start();

		const socket = liveDecodeSocket(token)

		socket.onopen = (event) => {
			console.log("[DEBUG] onopen") 
			console.log(event)
		}

		socket.onmessage = (event: MessageEvent) => {
			console.log("[DEBUG] onmessage") 
			console.log(event)
			const { data } = event;
			const response: LiveDecodeResponse = JSON.parse(data);
			if(response.status === 0){
				if(isHypothesisResponse(response)){
					console.log('Hypothesis detected')
					const { final, hypotheses } = response.result
					let transcript = hypotheses[0].transcript
					if(final){ // 100% of what the word is
						setFinalTranscription(fT => [...fT, transcript])
					}else{ // not 100% what the word is
						if(transcript.length > 80)
							setNonFinalTranscription("... ... " + transcript.substring(transcript.length-4, transcript.length));
					}

				}else{
					console.log('Adaptation detected')
					setAdaptationState((response as AdaptationStateResponse).adaptation_state)
				}

			}else if(response.status === 200){
				// TODO toast
				console.log("Successfully connected to server")
			}
		}

		socket.onerror = (error) => {
			console.log("[DEBUG] onerror") 
			console.log(error)
			socket.close()
		}

		socket.onclose = (event) => {
			console.log("[DEBUG] onclose") 
			console.log(event)
		}

		setWebSocket(socket)

		interval.current = setInterval(() => {
			if(recorder.instance)
				(recorder.instance as MediaRecorder).requestData()
			// clearInterval(interval.current!)
		},3000)
	}

	const onStopClick = () => {
		console.log("[DEBUG] onStopClick");
		recorder.instance.stop();
		clearInterval(interval.current!)
		webSocket?.close()

		console.log("[DEBUG] Final Transcript") 
		console.log(finalTranscription)
		console.log("[DEBUG] Non Final Transcript") 
		console.log(nonFinalTranscription)
	}


	/*  */
	useEffect(() => {
		reqMicrophoneAccess();

		/*	Workaround to prevent NoMicAccess from "blinking"
				Ideally, we want to use Permissions API to check 'microphone' permissions beforehand
					to know which state to present. However, available only in Chrome but not in Firefox.*/
		setTimeout(() => {
			setIsLoading(false);
		}, 500);


		console.log("check");
		return () => {
			if(interval)
				clearInterval(interval.current!);
			if(webSocket?.readyState === WebSocket.OPEN)
				webSocket?.close();
		}
	}, [])

	if (isLoading)
		return <Container></Container>
	if (recorder.hasAccess === false)
		return (
			<Container textAlign="center">
				<h1>Live Decoding</h1>
				<NoMicAccess errorMsg={recorder.errorMsg} />
			</Container>
		);
	else
		return (
			<Container textAlign="center">
				<h1>Live Decoding</h1>
				<p>Live decoding transcribes your speech into text as you speak into the microphone. Click the start button to begin decoding!</p>
				<Card fluid>
					<Card.Content>
						<Grid padded>
							<Grid.Row>
								<Grid.Column width={5}>
									<BtnsArray recorder={recorder.instance} onStartCb={onStartClick} onStopCb={onStopClick} />
								</Grid.Column>
								<Grid.Column width={8}>
									{/* <VizSineWave stream={recorder.stream} /> */}
									<VizFreqBars stream={recorder.stream} audioCtx={audioCtx} />
								</Grid.Column>
							</Grid.Row>

							<Grid.Row>
								<Grid.Column>
									<TextArea 
										placeholder='Press "Start" to begin ...' 
										rows={8}
										style={{ minHeight: '200px', minWidth: '100%', padding: '16px' }}
										disabled
										value={finalTranscription.toString() + nonFinalTranscription }
									/>
								</Grid.Column>
							</Grid.Row>
							{/* Debug */}
							<Grid.Row>
								{/* {showDownload.show && <a href={showDownload.url} download="audio.wav">Download Test</a>} */}
								{downloadLink.show && <a onClick={createDownloadLink}>Download Test</a>}
							</Grid.Row>
						</Grid>
					</Card.Content>
				</Card>
			</Container >
		);
}

export default React.memo(LiveDecodePage)