import React, { useEffect, useState } from "react";
import { Button, ButtonProps, Container, Dropdown, DropdownProps, Grid } from "semantic-ui-react";
import { convertToWAVFile, ConvToWavConfig } from "../../helpers/audio-helpers";
import { RecordingStates } from "../../pages/user/live-decode.page";
import styles from './live-decode-btns.module.scss';

interface Props {
	// worker: AudioWorkletNode,
	// onStartCb: Function,
	// onStopCb: Function,
	// webSocketConn: WebSocket
	isRecording: RecordingStates,
	onStartClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void,
	onStopClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void,
	// onDebugClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void, 
	allRecordedChunks: Float32Array[]
}


const LiveDecodeBtns: React.FC<Props> = (
	{ 
		allRecordedChunks, isRecording, onStartClick, onStopClick, 
		// onDebugClick
	}
) => {
	/* */
	const languageOptions = [
		{ key: 'eng_closetalk', text: 'English Closetalk', value: 'eng_closetalk' },
		{ key: 'eng_telephony', text: 'English Telephony', value: 'eng_telephony' },
		{ key: 'mandarin_closetalk', text: 'Mandarin Closetalk', value: 'mandarin_closetalk' },
		{ key: 'mandarin_telephony', text: 'Mandarin Telephony', value: 'mandarin_telephony' },
		{ key: 'malay_closetalk', text: 'Malay Closetalk', value: 'malay_closetalk' },
		{ key: 'engmalay_closetalk', text: 'English-Malay Closetalk', value: 'engmalay_closetalk' },
		{ key: 'cs_closetalk', text: 'Code Switch Closetalk', value: 'cs_closetalk' },
		{ key: 'cs_telephony', text: 'Code Switch Telephony', value: 'cs_telephony' },
	];
	const [selectedLangModel, setSelectedLangModel] = useState<string>("eng_closetalk");

	const [time, setTime] = useState(0);

	// const [adaptationState, setAdaptationState] = useState<AdaptationState>();
	// const adaptationStateRef = useRef<AdaptationState>();
	// adaptationStateRef.current = adaptationState;


	const onRedoClick = () => {
		window.location.reload();
	};

	const onDownloadClick = () => {
		console.log("[DEBUG] createDownloadLink");
		if (allRecordedChunks.length > 0) {
			const config: ConvToWavConfig = {
				sampleRate: 16000,
				// desiredSampRate: 16000,
				internalInterleavedLength: allRecordedChunks.length * allRecordedChunks[0].length,
				monoChnlBuffer: allRecordedChunks,
			};

			convertToWAVFile(config, function (buffer: any, view: any) {
				var blob = new Blob([buffer], { type: 'audio/x-wav' });
				console.log(blob);

				var url = URL.createObjectURL(blob);
				var anchor = document.createElement('a');
				anchor.style.display = 'none';
				document.body.appendChild(anchor);
				anchor.href = url;
				anchor.download = 'audio.wav';
				anchor.onclick = () => {
					requestAnimationFrame(() => {
						URL.revokeObjectURL(anchor.href);
					});
					document.body.removeChild(anchor);
				};
				anchor.click();
			});
		} else {
			console.error("[ERROR DEBUG] No recording found!");
		}
	};

	const onSelLanguageModelChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const {value} = data;
		console.log("[DEBUG] changed lang model: " + value);
		if(value && value !== ''){
			setSelectedLangModel(value as string);
		}
	};

	/* */
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRecording === RecordingStates.IN_PROGRESS) {
			interval = setInterval(() => {
				// console.log(time);
				setTime(prevTime => prevTime + 1);
			}, 1000);
		}

		return () => {
			console.log("[DEBUG] BtnsArray Unmounted");
			if (interval !== null) {
				console.log("[DEBUG] BtnsArray: Cleared Interval");
				clearInterval(interval);
			}
		};
	}, [isRecording]);

	return (
		<Container id={styles.btnsArrayContainer}>
			<Grid.Row id={styles.langModelDropdown}>
				<label>Select language model</label>
				<Dropdown
					scrolling
					labeled
					placeholder='Language Model'
					fluid
					selection
					defaultValue={"eng_closetalk"}
					options={languageOptions}
					onChange={onSelLanguageModelChange}
				/>
			</Grid.Row>
			<Grid.Row>
				{
					isRecording === RecordingStates.NOT_STARTED
						?
						<Button icon="circle" fluid primary onClick={onStartClick} content="Start" />
						:
						isRecording === RecordingStates.IN_PROGRESS
							?
							<Button
								icon="stop" fluid secondary onClick={onStopClick}
								content={`Stop (${("0" + Math.floor((time / 3600) % 3600)).slice(-1)}:${("0" + Math.floor((time / 60) % 60)).slice(-2)}:${("0" + Math.floor(time % 60)).slice(-2)})`
								}
							/>
							:
							<Button icon="redo" fluid basic color="orange" onClick={onRedoClick} content="Reset" />
				}
			</Grid.Row>
			<Grid.Row style={{ marginTop: '12px' }}>
				{
					isRecording === RecordingStates.STOPPED
						?
						<Button
							disabled={isRecording !== RecordingStates.STOPPED}
							fluid
							color="green"
							onClick={onDownloadClick}
							icon="cloud download"
							content="Download"
						/>
						:
						null
				}
			</Grid.Row>

			{/* <Grid.Row>
				<Button className="pink" onClick={onDebugClick}>Debug Button</Button>
			</Grid.Row> */}
		</Container>
	);
};

export default React.memo(LiveDecodeBtns);