import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Dropdown, DropdownProps, Grid, Icon, Popup } from 'semantic-ui-react';
import { getOneAudioRecordingFileSrcUrl } from '../../api/batch-transcribe-api';
import DownloadTranscriptButton from '../../components/audio/download-transcript-btn';
import { BatchTranscriptionHistory, LiveTranscriptionHistory } from '../../models/transcribe-history-response.model';
import styles from './view-one-transcript.module.scss';

const ViewOneTranscript: React.FC = () => {
	// history = history.type === 'live' ? (history as LiveTranscriptionHistory) : (history as BatchTranscriptionHistory);

	const [trackProgress, setTrackProgress] = useState(0);
	const [isLoadingAudio, setIsLoadingAudio] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(50);

	const audioRef = useRef(new Audio());
	const intervalRef = useRef<NodeJS.Timeout>();
	const duration = Math.ceil(audioRef.current.duration);

	const currentPercentage = duration
		? `${((trackProgress / duration) * 100)}%`
		: "0%";
	const trackStyling = `
		linear-gradient(to right, #3991da 0%, #3991da ${currentPercentage}, #999999 ${currentPercentage}, #999999 100%)
  `;

	const speedOptions = [
		{ key: 0.25, text: '0.25x', value: 0.25 },
		{ key: 0.5, text: '0.5x', value: 0.5 },
		{ key: 0.75, text: '0.75x', value: 0.75 },
		{ key: 1, text: '1x', value: 1 },
		{ key: 1.25, text: '1.25x', value: 1.25 },
		{ key: 1.5, text: '1.5x', value: 1.5 },
		{ key: 1.75, text: '1.75x', value: 1.75 },
		{ key: 2, text: '2x', value: 2 }
	];

	// const { selectedTranscriptHistory } = useSelector((state: RootState) => state.transcriptionHistoryReducer)
	//DEBUG
	const selectedTranscriptHistory: any =
	{
		"title": "This is a debugging object",
		"queue": "normal",
		"status": "done",
		"formats": [
			"stm",
			"srt",
			"TextGrid"
		],
		"sampling": "16khz",
		"lang": "english",
		"name": "Note",
		"_id": "6151968a7b428800306dea9b",
		"webhook": "https://2c55-42-61-133-176.ngrok.io",
		"userCreated": {
			"role": "user",
			"type": "normal",
			"name": "Noname",
			"_id": "5f7539cb8fb89d0029597fe4",
			"isBlocked": false,
			"isDeleted": false,
			"isVerified": true,
			"email": "user@ntu.edu.sg",
			"createdAt": "2020-10-01T02:07:07.992Z",
			"updatedAt": "2021-12-19T05:18:09.171Z",
			"__v": 0,
			"forgetPasswordCode": "603e1f",
			"forgetPasswordCodeSentAt": "2021-12-15T08:56:35.096Z"
		},
		"input": [
			{
				"isSubmitted": true,
				"errorCode": 0,
				"status": "done",
				"progress": [
					{
						"content": "DECODING",
						"createdAt": "2021-09-27T10:01:56.368Z"
					},
					{
						"content": "DONE",
						"createdAt": "2021-09-27T10:03:52.455Z"
					}
				],
				"_id": "6151968a7b428800306dea9d",
				"file": {
					"children": [],
					"parent": "",
					"_id": "6151968a7b428800306dea9c",
					"originalName": "file.wav",
					"mimeType": "audio/wave",
					"filename": "ebd77d5f-0856-4a0f-8f1b-213dfc9df544-1632736906012.wav",
					"size": 2474028,
					"duration": 12.885333,
					"userCreated": "5f7539cb8fb89d0029597fe4",
					"createdAt": "2021-09-27T10:01:46.352Z"
				}
			}
		],
		"type": "batch",
		"createdAt": "2021-09-27T10:01:46.308Z",
		"updatedAt": "2021-09-27T10:03:52.540Z",
		"__v": 0,
		"sourceFile": {
			"children": [],
			"parent": "",
			"_id": "6151968a7b428800306dea9c",
			"originalName": "file.wav",
			"mimeType": "audio/wave",
			"filename": "ebd77d5f-0856-4a0f-8f1b-213dfc9df544-1632736906012.wav",
			"size": 2474028,
			"duration": 12.885333,
			"userCreated": "5f7539cb8fb89d0029597fe4",
			"createdAt": "2021-09-27T10:01:46.352Z"
		}
	};

	const startTimer = () => {
		console.log("[DEBUG] Starting Timer...");
		// Clear any timers already running
		if (intervalRef.current)
			clearInterval(intervalRef.current);

		intervalRef.current = setInterval(() => {
			console.log("[DEBUG] audioRef currentTime: " + audioRef.current.currentTime);
			console.log("[DEBUG] audioRef currentTime MathRound: " + Math.round(audioRef.current.currentTime));
			console.log("[DEBUG] audioRef currentTime MathCeil: " + Math.ceil(audioRef.current.currentTime));
			if (!audioRef.current.ended) {
				setTrackProgress(Math.ceil(audioRef.current.currentTime));
			} else {
				setIsPlaying(false);
				if (trackProgress < audioRef.current.currentTime)
					setTrackProgress(audioRef.current.currentTime);
				if (intervalRef.current !== undefined)
					clearInterval(intervalRef.current!);
			}
		}, 1000);
	};

	const onPlayPauseClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (selectedTranscriptHistory !== undefined && audioRef.current.src === '') {
			try {
				setIsLoadingAudio(true);
				const res = await getOneAudioRecordingFileSrcUrl(selectedTranscriptHistory.input[0].file._id);
				audioRef.current = new Audio(res.data.url);
				audioRef.current.volume = 0.8;
				console.log("[DEBUG] Retrieved Audio File URL: " + res.data.url);
			} catch (error: any) {
				// TODO a better response with toast or Message at top is necessary
				if (error.status === 400)
					console.log("Unable to locate the audio file you are looking for. It may have bee deleted!");
				else
					console.log("Something terribly has occurred! Please contact an administrator!");
			}
		}
		if (!isPlaying) {
			setIsLoadingAudio(false);
			setIsPlaying(true);
		} else {
			setIsPlaying(false);
			console.log("[DEBUG] Pausing...");
			console.log(trackProgress);
			audioRef.current.currentTime = trackProgress;
			if (intervalRef.current)
				clearInterval(intervalRef.current);
		}
	};

	const onScrub = (newTimeValue: string) => {
		// Clear any timers already running
		if (intervalRef.current)
			clearInterval(intervalRef.current);

		audioRef.current.currentTime = Number(newTimeValue);
		setTrackProgress(audioRef.current.currentTime);
	};

	const onScrubEnd = () => {
		// If not already playing, start
		if (!isPlaying) {
			setIsPlaying(true);
		}
		startTimer();
	};

	const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e);
		if (audioRef.current.src !== '') {
			audioRef.current.volume = Number(e.target.value);
		}
		setVolume(Number(e.target.value));

	};

	const onPlaybackSpeedChange = (e: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) => {
		// console.log(e);
		// console.log(value);
		if (audioRef.current.src !== '') {
			audioRef.current.playbackRate = Number(value);
		}
	};

	const renderIcon = (h: (LiveTranscriptionHistory | BatchTranscriptionHistory)) => {
		if (h.type === 'live') {
			return (
				<Icon.Group size='big' className={styles.historyItemIcon}>
					<Icon size='large' name='circle' />
					<Icon name='microphone' />
				</Icon.Group>
			);
		} else { // batch transcribe has 4 statuses: 1. created, 2. decoding, 3. done, 4. error 
			if (h.input[0].status === 'error')
				return (
					<Icon.Group size='big' className={styles.historyItemIcon}>
						<Icon size='large' name='circle' className={styles.historyItemIconError} />
						<Icon name='file audio' />
					</Icon.Group>
				);

			let lastProgIdx = h.input[0].progress.length - 1;
			let progressStatus = h.input[0].progress[lastProgIdx].content.toLowerCase();
			if (progressStatus === 'done')
				return (
					<Icon.Group size='big' className={styles.historyItemIcon}>
						<Icon size='large' name='circle' />
						<Icon name='file audio' />
					</Icon.Group>
				);
			else if (progressStatus.includes("decoding")) {
				return (
					<Icon.Group size='big' className={styles.historyItemIcon}>
						<Icon size='large' loading name='circle notched' />
						<Icon name='file audio' />
					</Icon.Group>
				);
			}
		}

		return (<p>{h.name}</p>);
	};

	useEffect(() => {
		document.getElementsByClassName('pushable')[0]?.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
		// console.log(selectedTranscriptHistory);

		return () => {
			audioRef.current.pause();
			if (intervalRef.current)
				clearInterval(intervalRef.current);
		};
	}, []);

	useEffect(() => {
		console.log(`isPlaying: ${isPlaying} | isLoading: ${isLoadingAudio} | ${audioRef.current.src}`);
		if (isPlaying && !isLoadingAudio && audioRef.current.src !== '') {
			audioRef.current.play();
			startTimer();
		} else {
			audioRef.current.pause();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPlaying, isLoadingAudio]);


	//template
	if (typeof (selectedTranscriptHistory) !== undefined && selectedTranscriptHistory?._id !== undefined) {
		return (
			<Card fluid>
				{/* Card Header section */}
				<Card.Content id={styles.cardTopSection}>
					{
						renderIcon(selectedTranscriptHistory)
					}

					<Container id={styles.cardHeaderMetaContainer}>
						<Card.Header id={styles.cardHeader}>
							{selectedTranscriptHistory.title}
						</Card.Header>
						<Card.Meta>
							{selectedTranscriptHistory.lang.charAt(0).toUpperCase() + selectedTranscriptHistory.lang.slice(1)}
							{
								selectedTranscriptHistory.type === 'live'
									?  // Change any back to LiveTranscription
									" | " + moment.utc((selectedTranscriptHistory as any).liveSessionDuration * 1000).format("H:mm:ss")
									:
									" | " + moment.utc(selectedTranscriptHistory.input[0].file.duration * 1000).format("H:mm:ss")
							}
							{" | " + selectedTranscriptHistory.sampling}
							{" | " + selectedTranscriptHistory.input[0].file.mimeType + " | "}
							<span title={selectedTranscriptHistory.input[0].file.originalName}>
								{selectedTranscriptHistory.input[0].file.originalName.length > 15
									? selectedTranscriptHistory.input[0].file.originalName.slice(0, 5) + '...' + selectedTranscriptHistory.input[0].file.originalName.slice(-10)
									: selectedTranscriptHistory.input[0].file.originalName
								}
							</span>
						</Card.Meta>
					</Container>
					<DownloadTranscriptButton
						transcriptTitle={selectedTranscriptHistory.title}
						isDisabled={selectedTranscriptHistory.type === 'live'}
						transcriptId={selectedTranscriptHistory._id}
						id={styles.downloadBtn}
					/>
				</Card.Content>
				{/* END Card Header Section */}

				<Card.Content>
					<Card.Description>
						<p id={styles.transcriptPlayback}>
							The quick brown fox jumps over the lazy dog.
							The quick brown fox jumps over the lazy dog.
							The quick brown fox jumps over the lazy dog.
							The quick brown fox jumps over the lazy dog.
							The quick brown fox jumps over the lazy dog.
						</p>
					</Card.Description>
				</Card.Content>

				{/* Card Footer */}
				<Card.Content id={styles.audioControls}>
					<Grid>
						<Grid.Column width={2} className={styles.vAlignMiddle}>
							{
								isLoadingAudio
									?
									<Button icon disabled color="orange" labelPosition='left'>
										<Icon loading name='spinner' />Loading
									</Button>
									:
									isPlaying === false
										?
										<Button icon color="green" labelPosition='left' onClick={onPlayPauseClick}>
											<Icon name='play' />Play
										</Button>
										:
										<Button icon color="red" labelPosition='left' onClick={onPlayPauseClick}>
											<Icon name='pause' />Pause
										</Button>
							}

						</Grid.Column>
						<Grid.Column width={2} id={styles.playbackSpeedDropdown}>

							{/* TODO look at feel */}
							<Dropdown
								upward
								icon=""
								compact
								selection
								options={speedOptions}
								defaultValue={1}
								disabled={audioRef.current.src === ''}
								onChange={onPlaybackSpeedChange}
							/>

						</Grid.Column>
						<Grid.Column width={9} className={styles.vAlignMiddle}>
							{/* scrubber */}
							<input
								id={styles.playbackProgress}
								type="range"
								value={trackProgress}
								step="1.00"
								min="0"
								max={duration ? duration : `${duration}`}
								className="progress"
								onChange={(e) => onScrub(e.target.value)}
								onMouseUp={onScrubEnd}
								onKeyUp={onScrubEnd}
								style={{ background: trackStyling }}
								disabled={audioRef.current.src === ''}
							/>

						</Grid.Column>

						<Grid.Column width={1} className={styles.vAlignMiddle}>
							{/* Volume level */}
							<Popup
								trigger={<Button basic icon="volume up" disabled={audioRef.current.src === ''}></Button>}
								on='click'
								hideOnScroll
							>
								<input
									id={styles.volumeControl}
									type="range"
									min="0"
									step="0.01"
									max="1"
									value={volume}
									onChange={onVolumeChange}
									disabled={audioRef.current.src === ''}
								/>
							</Popup>
						</Grid.Column>
						<Grid.Column width={2} className={styles.vAlignMiddle}>
							{/* playback time */}
							{
								moment.utc(Math.ceil(trackProgress) * 1000).format("HH:mm:ss")
								+ "/"
								+ moment.utc(Math.ceil(selectedTranscriptHistory.input[0].file.duration) * 1000).format("HH:mm:ss")
							}
						</Grid.Column>
					</Grid>

				</Card.Content>

			</Card >
		);
	} else {
		return (
			<Container>
				<p>Something went wrong! Unable to load the resource, please try again!</p>
				<Button as={Link} to="/offlinetranscribe" negative>Go Back</Button>
			</Container>
		);
	}
};

export default ViewOneTranscript;