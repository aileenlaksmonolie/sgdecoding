import React, { useState } from "react";
import { Grid } from "semantic-ui-react";

const toWav = require('audiobuffer-to-wav');

const Oscilloscope: React.FC = () => {
	let player = React.useRef<HTMLAudioElement>(null)
	var audioContext = new (window.AudioContext || window.webkitAudioContext)()
	const fileReader = new FileReader()
	let mediaRecorder: MediaRecorder;

	let url: string = ""

	const [showDownload, setShowDownload] = useState({show: false, url: ''})

	// Set up file reader on loaded end event
	fileReader.onloadend = () => {

			const arrayBuffer = fileReader.result as ArrayBuffer

			// Convert array buffer into audio buffer
			audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {

				// Do something with audioBuffer
				console.log(audioBuffer)
				var test = toWav(audioBuffer)
				var blob = new Blob([new DataView(test)], {
					type: 'audio/wav'
				})
				url = URL.createObjectURL(blob);
				url = url + '.wav'
				setShowDownload({show: true, url })
				console.log(url)
				var url = window.URL.createObjectURL(blob)
				var anchor = document.createElement('a')
				anchor.style.display = 'none'
				document.body.appendChild(anchor)
				anchor.href = url
				anchor.download = 'audio.wav'
				anchor.click()
				window.URL.revokeObjectURL(url)
			})
	}

	const getMicrophoneAccess = async () => {
		let recordedChunks: Blob[] = []
		let stream

		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

			// Set HTML player (for debugging)
			// player.current!.srcObject = stream

			/* Create new Media Recorder */
			// Used to record a new file and/or upload			
			mediaRecorder = new MediaRecorder(stream);

			mediaRecorder.addEventListener('dataavailable', (e) => {
				if (e.data.size > 0) recordedChunks.push(e.data)
			})

			mediaRecorder.addEventListener('stop', async () => {
				var testBlob = new Blob(recordedChunks)
				fileReader.readAsArrayBuffer(testBlob)
			})

			mediaRecorder.start()

		} catch (error) {
			console.error(error)
		}
	}

	const stopRecording = () => {
		mediaRecorder.stop()

	}


	return (
		<Grid columns='2'>
			<Grid.Row>
				<h2>Building: Oscilloscope Component</h2>
			</Grid.Row>
			<Grid.Row>
				<audio ref={player as React.RefObject<HTMLAudioElement>} controls></audio>
			</Grid.Row>
			<Grid.Row>
				<button id="btnRecord" onClick={ getMicrophoneAccess }>Record Audio</button>
				<button id="btnStop" onClick={ stopRecording }>Stop Record</button>
				<button id="btnDownload">Download</button>

			</Grid.Row>
			<Grid.Row>
				{ showDownload.show && <a href={showDownload.url} download>Download Test</a> }
			</Grid.Row>
		</Grid>
	)
}

export default React.memo(Oscilloscope)