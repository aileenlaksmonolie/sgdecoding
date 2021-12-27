import { useEffect, useRef } from "react";

interface Props {
	stream: MediaStream,
	audioCtx: AudioContext
}

const VizFreqBars: React.FC<Props> = ({ stream, audioCtx}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null!)

	var analyser: AnalyserNode;
	var source: MediaStreamAudioSourceNode;
	var distortion: WaveShaperNode;
	var gainNode: GainNode;
	// var biquadFilter: BiquadFilterNode;
	// var convolver:ConvolverNode;

	var bufferLength: number;
	var dataArray: Uint8Array;

	let WIDTH: number = 0;
	let HEIGHT: number = 0;

	const draw = () => {
		requestAnimationFrame(draw);

		analyser.getByteFrequencyData(dataArray);

		let canvasCtx = canvasRef.current.getContext("2d")
		canvasCtx!.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

		var barWidth = (WIDTH / bufferLength) * 4.5;
		var barHeight;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i];

			canvasCtx!.fillStyle = 'rgb(' + (barHeight + 50) + ',50,150)';
			canvasCtx!.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

			x += barWidth + 1;
		}
	}

	useEffect(() => {
		if(canvasRef.current){
			WIDTH = canvasRef.current.width
			HEIGHT = canvasRef.current.height
		}
	}, [canvasRef.current])

	useEffect(() => {
		// We create a separate audio context here as we want to keep visualisation alive
		// const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

		analyser = audioCtx.createAnalyser()
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
		bufferLength = analyser.frequencyBinCount
		dataArray = new Uint8Array(bufferLength)

		source = audioCtx.createMediaStreamSource(stream);
		source.connect(analyser);
		analyser.connect(distortion);
		gainNode.gain.value = 0;
		distortion.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		// console.log(canvasRef.current)
		let canvasCtx = canvasRef.current.getContext("2d")
		if(canvasCtx){
			canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
			draw()
		}

	}, [stream])

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