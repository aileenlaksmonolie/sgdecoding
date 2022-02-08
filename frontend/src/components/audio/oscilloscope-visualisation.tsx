import { useCallback, useEffect, useRef, useState } from "react";
import { MyRecorder, RecordingStates } from "../../pages/user/live-decode.page";


interface Props {
	recorder: MyRecorder
}

const VizOscilloscope: React.FC<Props> = ({ recorder }) => {
	const { audioContext, stream, isRecording } = recorder;
	if (audioContext === null || stream === null)
		throw new Error("AudioContext or stream not found, unable to visualise.");

	var analyser = audioContext!.createAnalyser();
	var dataArray = useRef(new Uint8Array());

	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>();
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const draw = useCallback(() => {
		if (canvasRef.current)
			requestAnimationFrame(draw);

		var bufferLength = analyser.frequencyBinCount;
		analyser.getByteTimeDomainData(dataArray.current);

		if (isRecording === RecordingStates.NOT_STARTED || isRecording === RecordingStates.STOPPED) {
			canvasCtx!.fillStyle = 'rgb(244, 244, 252)';
		} else {
			canvasCtx!.fillStyle = 'rgb(252, 255, 252)';
		}

		canvasCtx!.fillRect(0, 0, width, height);
		canvasCtx!.lineWidth = 3;
		if (isRecording === RecordingStates.NOT_STARTED || isRecording === RecordingStates.STOPPED) {
			canvasCtx!.strokeStyle = 'rgb(138, 45, 209)';
		} else {
			canvasCtx!.strokeStyle = 'rgb(22, 95, 204)';
		}

		if (canvasRef.current) {
			canvasCtx!.beginPath();
			var sliceWidth = width * 1.0 / bufferLength;
			var x = 0;
			for (var i = 0; i < bufferLength; i++) {
				var v = dataArray.current[i] / 128.0;
				var y = v * height / 2;
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecording, height, width, canvasCtx]);

	useEffect(() => {
		setWidth(containerRef.current!.clientWidth);
		setHeight(containerRef.current!.clientHeight);
	}, []);

	useEffect(() => {
		if (width !== 0 && height !== 0) {
			// console.log(canvasRef.current);
			// console.log(canvasRef.current?.width);

			analyser.minDecibels = -40;
			analyser.maxDecibels = 0;
			analyser.smoothingTimeConstant = 0.9;
			var source: MediaStreamAudioSourceNode;
			var distortion = audioContext.createWaveShaper();
			var gainNode = audioContext.createGain();
			// var biquadFilter = audioContext.createBiquadFilter();
			// var convolver = audioContext.createConvolver();

			analyser.fftSize = 2048;
			dataArray.current = new Uint8Array(analyser.frequencyBinCount);

			source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);
			analyser.connect(distortion);
			gainNode.gain.value = 0;
			distortion.connect(gainNode);
			gainNode.connect(audioContext.destination);

			setCanvasCtx(canvasRef.current.getContext("2d"));
			if (canvasCtx) {
				canvasCtx!.clearRect(0, 0, width, height);
				draw();
			}
		}

		return () => {
			console.log("[DEBUG] Oscilloscope unmounted!");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stream, audioContext, draw, width, height, canvasCtx]);


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
	);
};

export default VizOscilloscope;