import { useEffect, useRef } from "react";


interface Props {
	stream: MediaStream
}

const Oscilloscope: React.FC<Props> = ({ stream }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	let WIDTH: number = 0
	let HEIGHT: number = 0

	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var analyser = audioCtx.createAnalyser();
	analyser.minDecibels = -90;
	analyser.maxDecibels = -10;
	analyser.smoothingTimeConstant = 0.9;
	var source: MediaStreamAudioSourceNode
	var distortion = audioCtx.createWaveShaper();
	var gainNode = audioCtx.createGain();
  var biquadFilter = audioCtx.createBiquadFilter();
  var convolver = audioCtx.createConvolver();

	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

	source = audioCtx.createMediaStreamSource(stream);
	source.connect(distortion);
	distortion.connect(biquadFilter);
	biquadFilter.connect(gainNode);
	convolver.connect(gainNode);
	gainNode.connect(analyser);
	analyser.connect(audioCtx.destination);

	var canvasCtx: CanvasRenderingContext2D | null

	// /* */

	const draw = () => {
		var drawVisual = requestAnimationFrame(draw);
		analyser.getByteTimeDomainData(dataArray);
		canvasCtx!.fillStyle = 'rgb(200, 200, 200)';
		canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);
		canvasCtx!.lineWidth = 2;
		canvasCtx!.strokeStyle = 'rgb(0, 0, 0)';
		canvasCtx!.beginPath();
		var sliceWidth = WIDTH * 1.0 / bufferLength;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * HEIGHT / 2;

			if (i === 0) {
				canvasCtx!.moveTo(x, y);
			} else {
				canvasCtx!.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx!.lineTo(canvasRef.current!.width, canvasRef.current!.height / 2);
		canvasCtx!.stroke();
	}

	useEffect(() => {
		console.log(canvasRef.current)
		console.log(canvasRef.current?.width)
		if (canvasRef.current) {
			WIDTH = canvasRef.current?.width
			HEIGHT = canvasRef.current?.height
		}
		canvasCtx = canvasRef.current!.getContext("2d")
		canvasCtx!.clearRect(0, 0, WIDTH, HEIGHT);

		draw()
	})


	return (
		<canvas
			ref={canvasRef}
			height="200"
			width="549"
			style={{ border: '1px solid gray' }}
		></canvas>
	)
}

export default Oscilloscope