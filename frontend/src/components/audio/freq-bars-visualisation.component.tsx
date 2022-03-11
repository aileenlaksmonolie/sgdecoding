import React, { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "semantic-ui-react";
import { useWindowSize } from "../../helpers/window-resize-hook";
import { MyRecorder, RecordingStates } from "../../pages/user/live-transcribe.page";

interface Props {
	recorder: MyRecorder
}

const VizFreqBars: React.FC<Props> = ({ recorder }) => {
	const { audioContext, stream, isRecording } = recorder;
	const [mediaError, setMediaError] = useState(false);


	// const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [winWidth, winHeight] = useWindowSize();

	var analyser: AnalyserNode;

	const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>();

	var dataArray = useRef(new Uint8Array());


	const draw = useCallback(() => {
		// console.log("drawing...");
		if (canvasRef.current) // Stop Recursive Call when component unmounts
			requestAnimationFrame(draw);

		var bufferLength: number = analyser.frequencyBinCount;
		analyser.getByteFrequencyData(dataArray.current);

		canvasCtx!.fillStyle = 'rgba(255,255,255,1)';
		// if (isRecording === RecordingStates.NOT_STARTED || isRecording === RecordingStates.STOPPED) {
		// 	canvasCtx!.fillStyle = 'rgb(244, 244, 252)';
		// } else {
		// 	canvasCtx!.fillStyle = 'rgb(252, 255, 252)';
		// }
		if (canvasRef.current) {
			canvasCtx!.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			var barWidth = ((canvasRef.current.width - (bufferLength - 1)) / bufferLength);
			var barHeight;
			var x = 0;

			for (var i = 0; i < bufferLength; i++) {
				barHeight = dataArray.current[i];

				if (isRecording === RecordingStates.NOT_STARTED) {
					canvasCtx!.fillStyle = 'rgba(' + (barHeight + 50) + ',50,150, 0.2)';
					canvasCtx!.fillRect(x, canvasRef.current.height - barHeight / 2, barWidth, barHeight / 2);
				} else if (isRecording === RecordingStates.STOPPED) {
					canvasCtx!.fillStyle = 'rgba(60,' + (barHeight + 60) + ',48, 0.2)';
					canvasCtx!.fillRect(x, canvasRef.current.height - barHeight / 2, barWidth, barHeight / 2);
				} else {
					canvasCtx!.fillStyle = 'rgba(' + (barHeight + 60) + ',60,48, 0.2)';
					canvasCtx!.fillRect(x, canvasRef.current.height - barHeight / 2, barWidth, barHeight / 2);
				}

				x += barWidth + 1;
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecording, canvasCtx]); // Do not add analyser



	useEffect(() => {
		if (canvasRef.current != null) {
			// set the pixels drawn to match the space allocated
			canvasRef.current.height = canvasRef.current.clientHeight;
			canvasRef.current.width = canvasRef.current.clientWidth;
		}
	}, [winWidth, winHeight]);


	useEffect(() => {
		if (audioContext !== null && stream !== null) {
			analyser = audioContext!.createAnalyser();
			var source: MediaStreamAudioSourceNode;
			var distortion: WaveShaperNode;
			var gainNode: GainNode;

			analyser.minDecibels = -90;
			analyser.maxDecibels = -10;
			analyser.smoothingTimeConstant = 0.9;

			distortion = audioContext!.createWaveShaper();
			gainNode = audioContext!.createGain();
			distortion.oversample = '4x';

			analyser.fftSize = 128; // fft = fast fourier transform
			dataArray.current = new Uint8Array(analyser.frequencyBinCount);


			source = audioContext!.createMediaStreamSource(stream!);
			if (source.channelCount >= 1) {
				source.connect(analyser);
				analyser.connect(distortion);
				gainNode.gain.value = 0;
				distortion.connect(gainNode);
				gainNode.connect(audioContext!.destination);

				// console.log(canvasRef.current)
				setCanvasCtx(canvasRef.current!.getContext("2d"));
			}

			if (canvasCtx) {
				canvasCtx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
				draw();
			}
		} else {
			setMediaError(true);
		}

		return () => {
			// console.log("freq-bars unmounted");
			setCanvasCtx(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canvasRef.current]); // Do not add analyser

	return (
		mediaError
			?
			<div style={{ color: '#777' }}>
				<p><Icon name='warning sign'></Icon>Unable to load visualisation</p>
			</div>
			:
			<canvas
				ref={canvasRef as React.MutableRefObject<HTMLCanvasElement | null>}
				style={{ width: '100%', height: '100%', maxHeight: '200px' }}
				role="img"
				aria-label="Frequency Bars Animation"
			></canvas>
	);
};

export default VizFreqBars;