import { useCallback, useEffect, useRef } from "react";
import { MyRecorder } from "../../pages/user/LiveDecodePage";

interface Props {
	recorder: MyRecorder
}

const VizFreqBars: React.FC<Props> = ({ recorder }) => {
	const { audioContext, stream, isRecording } = recorder;

	if (audioContext === null || stream === null)
		throw new Error("AudioContext or stream not found, unable to visualise.")

	const canvasRef = useRef<HTMLCanvasElement>(null!)

	var analyser = audioContext!.createAnalyser();

	var width = useRef(0);
	var height = useRef(0);

	var dataArray = useRef(new Uint8Array());


	const draw = useCallback(() => {
		requestAnimationFrame(draw);

		var bufferLength: number = analyser.frequencyBinCount;
		analyser.getByteFrequencyData(dataArray.current);


		let canvasCtx = canvasRef.current.getContext("2d")
		canvasCtx!.fillStyle = 'rgb(244, 244, 252)';
		canvasCtx!.fillRect(0, 0, width.current, height.current);

		var barWidth = (width.current / bufferLength) * 4.5;
		var barHeight;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray.current[i];

			if (!isRecording) {
				canvasCtx!.fillStyle = 'rgb(' + (barHeight + 50) + ',50,150)';
				canvasCtx!.fillRect(x, height.current - barHeight / 2, barWidth, barHeight / 2);
			}else{
				canvasCtx!.fillStyle = 'rgb(60,' + (barHeight + 60) + ',145)';
				canvasCtx!.fillRect(x, height.current - barHeight / 2, barWidth, barHeight / 2);
			}

			x += barWidth + 1;
		}
	}, [isRecording]); // Do not add analyser

	useEffect(() => {

		console.log("isRecxording in FreqBars: " + isRecording)

	}, [isRecording]);


	useEffect(() => {
		if (canvasRef.current) {
			width.current = canvasRef.current.width;
			height.current = canvasRef.current.height;
		}

		// We create a separate audio context here as we want to keep visualisation alive
		// const audioContext = new (window.AudioContext || window.webkitAudioContext)()
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
		let canvasCtx = canvasRef.current.getContext("2d")
		if (canvasCtx) {
			canvasCtx.clearRect(0, 0, width.current, height.current);
			draw()
		}

	}, [stream, audioContext, draw]) // Do not add analyser

	return (
		<canvas
			ref={canvasRef as React.MutableRefObject<HTMLCanvasElement | null>}
			height="150"
			width="500"
			style={{ boxShadow: '0px 1px 3px 0px #d4d4d5, 0px 0px 0px 1px #d4d4d5' }}
		></canvas>
	)
}

export default VizFreqBars