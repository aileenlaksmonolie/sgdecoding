import { useCallback, useEffect, useRef } from "react";

interface Props {
	stream: MediaStream,
	audioCtx: AudioContext
}

const VizFreqBars: React.FC<Props> = ({ stream, audioCtx}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null!)

	var analyser = audioCtx.createAnalyser();

	var width = useRef(0);
	var height = useRef(0);

	var dataArray = useRef(new Uint8Array());


	const draw = useCallback(() => {
		requestAnimationFrame(draw);

		var bufferLength: number = analyser.frequencyBinCount;
		analyser.getByteFrequencyData(dataArray.current);

		let canvasCtx = canvasRef.current.getContext("2d")
		canvasCtx!.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx!.fillRect(0, 0, width.current, height.current);

		var barWidth = (width.current / bufferLength) * 4.5;
		var barHeight;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray.current[i];

			canvasCtx!.fillStyle = 'rgb(' + (barHeight + 50) + ',50,150)';
			canvasCtx!.fillRect(x, height.current - barHeight / 2, barWidth, barHeight / 2);

			x += barWidth + 1;
		}
	}, [analyser]);

	useEffect(() => {
		if(canvasRef.current){
			width.current = canvasRef.current.width;
			height.current = canvasRef.current.height;
		}
	}, [])

	useEffect(() => {
		// We create a separate audio context here as we want to keep visualisation alive
		// const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
		var source: MediaStreamAudioSourceNode;
		var distortion: WaveShaperNode;
		var gainNode: GainNode;

		analyser.minDecibels = -90
		analyser.maxDecibels = -10
		analyser.smoothingTimeConstant = 0.9

		distortion = audioCtx.createWaveShaper()
		gainNode = audioCtx.createGain()
		// biquadFilter = audioCtx.createBiquadFilter()
		// convolver = audioCtx.createConvolver()
		distortion.oversample = '4x'
		// biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)
	
		analyser.fftSize = 256
		dataArray.current = new Uint8Array(analyser.frequencyBinCount)

		source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);
		analyser.connect(distortion);
		gainNode.gain.value = 0;
		distortion.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		// console.log(canvasRef.current)
		let canvasCtx = canvasRef.current.getContext("2d")
		if(canvasCtx){
			canvasCtx.clearRect(0, 0, width.current, height.current);
			draw()
		}

	}, [stream, analyser, audioCtx, draw])

	return (
		<canvas
			ref={canvasRef as React.MutableRefObject<HTMLCanvasElement | null>}
			height="150"
			width="500"
			style={{ border: '1px solid gray' }}
		></canvas>
	)
}

export default VizFreqBars