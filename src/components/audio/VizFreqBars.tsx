import { useEffect, useRef } from "react";

interface Props {
	stream: MediaStream,
	audioCtx: AudioContext 
}

const VizFreqBars: React.FC<Props> = ({ stream, audioCtx}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	let WIDTH: number = 0
	let HEIGHT: number = 0

	var analyser = audioCtx.createAnalyser()
	analyser.minDecibels = -90
	analyser.maxDecibels = -10
	analyser.smoothingTimeConstant = 0.9
	var source: MediaStreamAudioSourceNode
	var distortion = audioCtx.createWaveShaper()
	var gainNode = audioCtx.createGain()
	var biquadFilter = audioCtx.createBiquadFilter()
	var convolver = audioCtx.createConvolver()

	distortion.oversample = '4x'
	biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)

	analyser.fftSize = 256
	var bufferLength = analyser.frequencyBinCount
	var dataArray = new Uint8Array(bufferLength)

	// biquadFilter.type = "lowshelf";
	// biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0)
	// biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)

	// source = audioCtx.createMediaStreamSource(stream)
	// source.connect(distortion)
	// distortion.connect(biquadFilter)
	// biquadFilter.connect(gainNode)
	// convolver.connect(gainNode)
	// gainNode.connect(analyser)
	// analyser.connect(audioCtx.destination)

	source = audioCtx.createMediaStreamSource(stream);
	source.connect(analyser);
	analyser.connect(distortion);
	distortion.connect(audioCtx.destination);

	var canvasCtx: CanvasRenderingContext2D | null

	const draw = () => {
		var drawVisual = requestAnimationFrame(draw);

		analyser.getByteFrequencyData(dataArray);

		canvasCtx!.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);

		var barWidth = (WIDTH / bufferLength) * 4.5;
		var barHeight;
		var x = 0;

		for (var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i];

			canvasCtx!.fillStyle = 'rgb(' + (barHeight + 150) + ',50,50)';
			canvasCtx!.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

			x += barWidth + 1;
		}
	}

	// const makeDistortionCurve = (amount: any) => {
  //   var k = typeof amount === 'number' ? amount : 50,
  //     n_samples = 44100,
  //     curve = new Float32Array(n_samples),
  //     deg = Math.PI / 180,
  //     i = 0,
  //     x;
  //   for ( ; i < n_samples; ++i ) {
  //     x = i * 2 / n_samples - 1;
  //     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  //   }
  //   return curve;
  // };

	// distortion.curve = makeDistortionCurve(400)

	useEffect(() => {
		// console.log(canvasRef.current)
		// console.log(canvasRef.current?.width)
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
			height="150"
			width="500"
			style={{ border: '1px solid gray' }}
		></canvas>
	)
}

export default VizFreqBars