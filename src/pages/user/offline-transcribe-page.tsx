import moment from 'moment';
import React, { useEffect, useState } from "react";
import Moment from 'react-moment';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Card, Container, Dropdown, DropdownProps, Grid, Header, Icon, List, Pagination, PaginationProps, Portal, Segment } from "semantic-ui-react";
import { BatchTranscriptionHistory, LiveTranscriptionHistory } from '../../models/transcribe-history-response.model';
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './offline-transcribe-page.module.scss';

const ITEMS_PER_PAGE = 7;

const OfflineTranscribePage: React.FC = () => {

	const { history, totalHistory } = useSelector((state: RootState) => state.transcriptionHistoryReducer)

	const dispatch = useDispatch();
	const { getLoggedInUserTranscriptionHistory } = bindActionCreators(actionCreators, dispatch)

	const [noOfPages, setNoOfPages] = useState(0)
	const [itemsToDisplay, setItemsToDisplay] = useState<Array<LiveTranscriptionHistory | BatchTranscriptionHistory>>([]);
	const [filteredHistory, setFilteredHistory] = useState<Array<LiveTranscriptionHistory | BatchTranscriptionHistory>>([]);

	const [filters, setFilters] = useState({
		type: '',
		lang: [''],
		duration: ''
	});

	const typeFilterOptions = [
		{ key: 'live', text: "Live", value: 'live' },
		{ key: 'batch', text: "Offline", value: 'batch' }
	]

	const langFilterOptions = [
		{ key: 'english', text: 'English', value: 'english' },
		{ key: 'malay', text: 'Malay', value: 'malay' },
		{ key: 'mandarin', text: 'Mandarin', value: 'mandarin' },
		{ key: 'english-malay', text: 'English-Malay', value: 'english-malay' },
		{ key: 'english-mandarin', text: 'English-Mandarin', value: 'english-mandarin' }
	]

	const lengthFilterOptions = [
		{ key: 'short', text: '< 3 mins', value: 'short' },
		{ key: 'medium', text: '3 - 10mins', value: 'medium' },
		{ key: 'long', text: '> 10mins', value: 'long' }
	]

	const handleTypeFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setFilters({ ...filters, type: data.value as string });
	}

	const handleLangFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setFilters({ ...filters, lang: data.value as [] })
	}

	const handleLengthFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		setFilters({ ...filters, duration: data.value as string })
	}

	const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
		// console.log("Selected page: " + activePage);
		// if (filters.duration === '' && filters.lang[0] === '' && filters.type === '') {
		activePage = activePage as number;
		let startIdx = (ITEMS_PER_PAGE * (activePage - 1))
		let endIdx = ((activePage * ITEMS_PER_PAGE))
		setItemsToDisplay(filteredHistory.slice(startIdx, endIdx))
		// }
	}

	useEffect(() => {
		// getLoggedInUserTranscriptionHistory()
	}, []);

	useEffect(() => {
		console.log("[DEBUG] Num of transcription history: " + totalHistory);
		console.log(filters)

		if (filters.duration === '' && filters.lang[0] === '' && filters.type === '') {
			console.log("[DEBUG] Not Filtering");
			console.log(history);
			setNoOfPages(Math.ceil(totalHistory / ITEMS_PER_PAGE));
			let firstItems = history.slice(0, ITEMS_PER_PAGE);
			setFilteredHistory(history);
			setItemsToDisplay(firstItems);
		} else {
			console.log("[DEBUG] Filtering history")
			let filteredItems = history.filter((i) => {
				let audioDuration = (i as LiveTranscriptionHistory).liveSessionDuration | i.input[0].file.duration;
				if (filters.duration !== '') {
					if (filters.duration === 'short' && (audioDuration > 180))
						return false;
					else if (filters.duration === 'medium' && audioDuration < 180 && audioDuration > 600)
						return false;
					else if (filters.duration === 'long' && audioDuration < 600)
						return false;
				}

				if (filters.type !== '' && i.type !== filters.type)
					return false;

				if (filters.lang[0] !== '' && !filters.lang.includes(i.lang))
					return false;

				return true;
			})
			// console.log(filteredItems);
			setFilteredHistory(filteredItems);
			setItemsToDisplay(filteredItems.slice(0, ITEMS_PER_PAGE));
			setNoOfPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
		}

	}, [history, totalHistory, filters])


	const renderIcon = (h: (LiveTranscriptionHistory | BatchTranscriptionHistory)) => {
		if (h.type === 'live') {
			return (
				<Icon.Group size='big' className={styles.historyItemIcon}>
					<Icon size='large' name='circle' />
					<Icon name='microphone' />
				</Icon.Group>
			)
		} else { // batch transcribe has 4 statuses: 1. created, 2. decoding, 3. done, 4. error 
			if (h.input[0].status === 'error')
				return (
					<Icon.Group size='big' className={styles.historyItemIcon}>
						<Icon size='large' name='circle' className={styles.historyItemIconError} />
						<Icon name='file audio' />
					</Icon.Group>
				)

			let lastProgIdx = h.input[0].progress.length - 1;
			let progressStatus = h.input[0].progress[lastProgIdx].content.toLowerCase();
			if (progressStatus === 'done')
				return (
					<Icon.Group size='big' className={styles.historyItemIcon}>
						<Icon size='large' name='circle' />
						<Icon name='file audio' />
					</Icon.Group>
				)
			else if (progressStatus.includes("decoding")) {
				<Icon.Group size='big' className={styles.historyItemIcon}>
					<Icon size='large' loading name='circle notched' />
					<Icon name='file audio' />
				</Icon.Group>
			}
		}

		return (<p>{h.name}</p>)
	}

	// template
	return (
		<Container id={styles.offlineTranscribePg}>
			<Card fluid id={styles.introSection}>
				<Card.Description textAlign="center">
					<Container text>
						<Header textAlign="center" as="h1">Offline Transcribe</Header>
						<p>
							In offline transcribing, you may upload local audio files and our servers will
							generate the text for you. The time taken for the transcription process depends
							on the length of audio file.
						</p>
						<Button color="teal">Upload Audio Files / Record Now</Button>
					</Container>
				</Card.Description>
			</Card>

			<Header as="h2">View Previous Transcription Jobs</Header>

			<Grid columns={8}>
				<Grid.Column></Grid.Column>
				<Grid.Column width={3}>
					<Dropdown
						placeholder='Filter Live/Offline'
						fluid
						selection
						options={typeFilterOptions}
						onChange={handleTypeFilterChange}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Dropdown
						placeholder='Filter Language'
						fluid
						multiple
						selection
						options={langFilterOptions}
						key="test"
						onChange={handleLangFilterChange}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Dropdown
						placeholder='Filter Length'
						fluid
						selection
						options={lengthFilterOptions}
						onChange={handleLengthFilterChange}
					/>
				</Grid.Column>
				<Grid.Column width={3}>
					<Button
						content='Filter Dates'
						disabled={false}
						basic
						fluid
						// color="grey"
					// onClick={handleOpen}
					/>

					<Portal
					// onClose={handleClose} 
					// open={open}
					>
						<Segment
							style={{
								left: '40%',
								position: 'fixed',
								top: '50%',
								zIndex: 1000,
							}}
						>
							<Header>This is a controlled portal</Header>
							<p>Portals have tons of great callback functions to hook into.</p>
							<p>To close, simply click the close button or click away</p>

							<Button
								content='Close Portal'
								negative
							// onClick={handleClose}
							/>
						</Segment>
					</Portal>
				</Grid.Column>
				<Grid.Column></Grid.Column>
			</Grid>

			{/* List of Transcription Jobs  */}
			<List divided size="large" verticalAlign="middle" className={styles.historyList}>
				{
					// TODO Componentise this!
					itemsToDisplay.map(h => (
						<List.Item
							key={h._id}
							className={styles.historyItem}
						>
							<List.Content floated='right' className={styles.historyItemBtns}>
								<Button color="blue">View</Button>
								<Button color="green">Download</Button>
								<Button color="red" disabled>Delete</Button>
							</List.Content>
							{
								renderIcon(h)
							}
							<List.Content className={styles.historyItemContent}>
								<List.Header as='p'>
									{h.type === 'live' ? "Live Transcribe on " : "File Upload on "}
									<Moment format="ddd D MMM YYYY, h:mma">{h.createdAt}</Moment>
									{h.input[0].errorCode !== null ? ` (${h.input[0].errorCode})` : ''}

									{/* DEBUG */}
									{/* {" | " + h.input[0].status} */}

								</List.Header>
								<List.Description as='p'>
									{h.lang.charAt(0).toUpperCase() + h.lang.slice(1)}
									{
										h.type === 'live'
											?
											" | " + moment.utc((h as LiveTranscriptionHistory).liveSessionDuration * 1000).format("H:mm:ss")
											:
											" | " + moment.utc(h.input[0].file.duration * 1000).format("H:mm:ss")
									}
									{" | " + h.sampling}
									{" | " + h.input[0].file.mimeType + " | "}
									<span title={h.input[0].file.originalName}>
										{h.input[0].file.originalName.length > 15
											? h.input[0].file.originalName.slice(0, 5) + '...' + h.input[0].file.originalName.slice(-10)
											: h.input[0].file.originalName
										}
									</span>
								</List.Description>
							</List.Content>
						</List.Item>
					))
				}
			</List>

			{/* Paginator */}
			<Pagination
				defaultActivePage={1}
				onPageChange={handlePageChange}
				ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
				firstItem={{ content: <Icon name='angle double left' />, icon: true }}
				lastItem={{ content: <Icon name='angle double right' />, icon: true }}
				prevItem={{ content: <Icon name='angle left' />, icon: true }}
				nextItem={{ content: <Icon name='angle right' />, icon: true }}
				totalPages={noOfPages}
			/>
		</Container>
	);
}

export default OfflineTranscribePage;