import React, { useCallback, useEffect, useRef, useState } from "react";
import { MyRecorder, RecordingStates } from "../../pages/user/LiveDecodePage";

interface Props {
	recorder: MyRecorder
}

const VizFreqBars: React.FC<Props> = ({ recorder }) => {
	const { audioContext, stream, isRecording } = recorder;

	if (audioContext === null || stream === null)
		throw new Error("AudioContext or stream not found, unable to visualise.")

	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null!)

	var analyser = audioContext!.createAnalyser();

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>();

	var dataArray = useRef(new Uint8Array());


	const draw = useCallback(() => {
		requestAnimationFrame(draw);

		var bufferLength: number = analyser.frequencyBinCount;
		analyser.getByteFrequencyData(dataArray.current);

		canvasCtx!.fillStyle = 'rgb(244, 244, 252)';
		canvasCtx!.fillRect(0, 0, width, height);
		//TODO fix this!
		var barWidth = ((width / bufferLength) * (width % 20));
		// console.log(barWidth)
		// console.log(bufferLength)
		var barHeight;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray.current[i];

			if (isRecording === RecordingStates.NOT_STARTED || isRecording === RecordingStates.STOPPED) {
				canvasCtx!.fillStyle = 'rgb(' + (barHeight + 50) + ',50,150)';
				canvasCtx!.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
			} else {
				canvasCtx!.fillStyle = 'rgb(60,' + (barHeight + 60) + ',145)';
				canvasCtx!.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);
			}

			x += barWidth + 1;
		}

	}, [isRecording, height, width, canvasCtx]); // Do not add analyser

	// useEffect(() => {

	// 	console.log("isRecxording in FreqBars: " + isRecording)

	// }, [isRecording]);

	useEffect(() => {
		// if (canvasRef.current) {
		// width.current = canvasRef.current.width;
		// height.current = canvasRef.current.height;
		// }
		setWidth(containerRef.current!.clientWidth);
		setHeight(containerRef.current!.clientHeight);
	}, [])


	useEffect(() => {

		// We create a separate audio context here as we want to keep visualisation alive
		// const audioContext = new (window.AudioContext || window.webkitAudioContext)()
		// console.log(width + ' ' + height)

		if (width !== 0 && height !== 0) {
			var source: MediaStreamAudioSourceNode;
			var distortion: WaveShaperNode;
			var gainNode: GainNode;

			analyser.minDecibels = -90
			analyser.maxDecibels = -10
			analyser.smoothingTimeConstant = 0.9

			distortion = audioContext.createWaveShaper()
			gainNode = audioContext.createGain()
			// biquadFilter = audioContext.createBiquadFilter()
			// convolver = audioContext.createConvolver()
			distortion.oversample = '4x'
			// biquadFilter.gain.setTargetAtTime(0, audioContext.currentTime, 0)

			analyser.fftSize = 256
			dataArray.current = new Uint8Array(analyser.frequencyBinCount)

			source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);
			analyser.connect(distortion);
			gainNode.gain.value = 0;
			distortion.connect(gainNode);
			gainNode.connect(audioContext.destination);

			// console.log(canvasRef.current)
			setCanvasCtx(canvasRef.current.getContext("2d"));
			if (canvasCtx) {
				canvasCtx.clearRect(0, 0, width, height);
				draw();
			}

		}

	}, [stream, audioContext, draw, width, height, canvasCtx]) // Do not add analyser

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				minHeight: '200px'
			}}
			ref={containerRef}>

			{
				width !== 0
					?
					<canvas
						ref={canvasRef as React.MutableRefObject<HTMLCanvasElement | null>}
						width={width}
						height={height}
						style={{ boxShadow: '0px 1px 3px 0px #d4d4d5, 0px 0px 0px 1px #d4d4d5' }}
					></canvas>
					:
					<p>Loading...</p>
			}
		</div>
	)
}

export default VizFreqBars