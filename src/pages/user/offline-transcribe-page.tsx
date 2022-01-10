import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router';
import { bindActionCreators } from "redux";
import { Button, Card, Container, Dropdown, DropdownProps, Form, Grid, Header, Icon, InputOnChangeData, List, Pagination, PaginationProps, Popup } from "semantic-ui-react";
import DownloadTranscriptButton from '../../components/audio/download-transcript-btn';
import { BatchTranscriptionHistory, LiveTranscriptionHistory } from '../../models/transcribe-history-response.model';
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './offline-transcribe-page.module.scss';

const ITEMS_PER_PAGE = 7;

interface TranscriptionHistoryFilter {
	type: string,
	lang: string[],
	duration: string,
	startDate: string,
	endDate: string
}

const OfflineTranscribePage: React.FC = () => {

	const navigate = useNavigate();
	const { history, totalHistory } = useSelector((state: RootState) => state.transcriptionHistoryReducer)
	const dispatch = useDispatch();
	const { getLoggedInUserTranscriptionHistory, setSelectedTranscriptionHistory } = bindActionCreators(actionCreators, dispatch)

	const [noOfPages, setNoOfPages] = useState(0)
	const [itemsToDisplay, setItemsToDisplay] = useState<Array<LiveTranscriptionHistory | BatchTranscriptionHistory>>([]);
	const [filteredHistory, setFilteredHistory] = useState<Array<LiveTranscriptionHistory | BatchTranscriptionHistory>>([]);

	const [defDateVals, setDefDateVals] = useState<{ startDate: string, endDate: string }>(); // workaround, can't get setValue to work

	const [filters, setFilters] = useState<TranscriptionHistoryFilter>({
		type: '',
		lang: [],
		duration: '',
		startDate: '',
		endDate: ''
	});


	const typeFilterOptions = [
		{ key: 'none', text: 'Both', value: '' },
		{ key: 'live', text: "Live", value: 'live' },
		{ key: 'batch', text: "Offline", value: 'batch' }
	];

	const langFilterOptions = [
		{ key: 'english', text: 'English', value: 'english' },
		{ key: 'malay', text: 'Malay', value: 'malay' },
		{ key: 'mandarin', text: 'Mandarin', value: 'mandarin' },
		{ key: 'english-malay', text: 'English-Malay', value: 'english-malay' },
		{ key: 'english-mandarin', text: 'English-Mandarin', value: 'english-mandarin' }
	];

	const {
		register,
		setValue,
		watch,
		getValues,
		trigger,
		formState: { errors }
	} = useForm({ mode: 'onChange' });

	const lengthFilterOptions = [
		{ key: 'all', text: 'All', value: '' },
		{ key: 'short', text: '< 3 mins', value: 'short' },
		{ key: 'medium', text: '3 - 10mins', value: 'medium' },
		{ key: 'long', text: '> 10mins', value: 'long' }
	];

	const handleTypeFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		console.log(data)
		setFilters({ ...filters, type: data.value as string });
	}

	const handleLangFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		console.log(data)
		// if(data.value !== '')
		setFilters({ ...filters, lang: data.value as [] })
		console.log(filters)
	}

	const handleLengthFilterChange = (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		console.log(data)
		setFilters({ ...filters, duration: data.value as string })
	}

	const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { activePage }: PaginationProps) => {
		// console.log("Selected page: " + activePage);
		// if (filters.duration === '' && filters.lang[0] === '' && filters.type === '') {
		activePage = activePage as number;
		let startIdx = (ITEMS_PER_PAGE * (activePage - 1))
		let endIdx = ((activePage * ITEMS_PER_PAGE))
		setItemsToDisplay(filteredHistory.slice(startIdx, endIdx));
		// }
	}

	const handlePopupOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		console.log("[DEBUG] Form values when popup triggered");
		console.log(getValues("startDate"));
		console.log(getValues("endDate"));

		if (filters.startDate === '' && filters.endDate === '') {
			console.log("setting form default values")
			let startDate = history[history.length - 1].createdAt.slice(0, 10);
			let endDate = history[0].createdAt.slice(0, 10);
			setFilters({ ...filters, startDate, endDate });

			// Set the default start date and end date in filters
			setDefDateVals({ startDate, endDate });
			setValue("startDate", startDate);
			setValue("endDate", endDate);
		}
	}

	const handleViewBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
		console.log(e);
		console.log(id);
		let clickedTranscriptHistory = history.find(h => h._id === id);

		if(clickedTranscriptHistory){
			setSelectedTranscriptionHistory(clickedTranscriptHistory);
			navigate(`/viewonetranscript?id=${id}`);
		}

		//TODO show a toast error
		
	}

	const onDateInputChange = (e: React.ChangeEvent<HTMLInputElement>, { name, value }: InputOnChangeData) => {
		setValue(name, value);
		trigger(['startDate', 'endDate']);
		setFilters({ ...filters, startDate: getValues("startDate"), endDate: getValues("endDate") });
		// because form is re-created when popup is opened again
		setDefDateVals({ startDate: getValues("startDate"), endDate: getValues("endDate") });
	}

	useEffect(() => {
		getLoggedInUserTranscriptionHistory();

		register("startDate", {
			// valueAsDate: true,
			validate: sD => sD <= getValues("endDate") || 'Start Date must be before or same as End Date'
		});

		register("endDate", {
			// valueAsDate: true,
			validate: eD => eD >= getValues("startDate") || 'End Date must be after or same as Start Date'
		});

	}, [register, getValues]);

	/**
	 * Set the paginator and display the first transcription history
	 */
	useEffect(() => {
		console.log("[DEBUG] Total Transcription History count: " + totalHistory);
		console.log(history);

		if (history.length > 0) {
			setNoOfPages(Math.ceil(totalHistory / ITEMS_PER_PAGE));
			let firstItems = history.slice(0, ITEMS_PER_PAGE);
			setFilteredHistory(history);
			setItemsToDisplay(firstItems);
		}
	}, [history, totalHistory]);

	/**
	 * Change the displayed transcription history as user changed the filters
	 */
	useEffect(() => {
		console.log("[DEBUG] Filtering ... ...");
		console.log(history)
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

			if (filters.lang.length !== 0 && !filters.lang.includes(i.lang))
				return false;

			if (filters.startDate !== '' && filters.endDate !== '') {
				if (i.createdAt.slice(0, 10) < filters.startDate
					|| i.createdAt.slice(0, 10) > filters.endDate)
					return false
			}

			return true;
		});
		// console.log(filteredItems);
		setFilteredHistory(filteredItems);
		setItemsToDisplay(filteredItems.slice(0, ITEMS_PER_PAGE));
		setNoOfPages(Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
	}, [filters]);


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
					<Popup
						id={styles.dateFilterPopup}
						trigger={
							<Button basic fluid>{
								filters.startDate !== ''
									?
									moment(filters.startDate).format("DD MMM YY") + " - " + moment(filters.endDate).format("DD MMM YY")
									:
									"Filter Dates"}
							</Button>
						}
						flowing
						hideOnScroll
						on="click"
						onOpen={handlePopupOpen}
					>
						<Form
							noValidate
						>
							<Form.Field >
								<Form.Input
									fluid
									label="Start Date"
									name="startDate"
									type='date'
									defaultValue={defDateVals?.startDate}
									onChange={onDateInputChange}
									error={errors.startDate ? { content: errors.startDate.message } : false}
								/>
							</Form.Field>
							<Form.Field>
								<Form.Input
									fluid
									label="End Date"
									name="endDate"
									type='date'
									defaultValue={defDateVals?.endDate}
									onChange={onDateInputChange}
									error={errors.endDate ? { content: errors.endDate.message } : false}
								/>
							</Form.Field>
						</Form>
					</Popup>
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
								<Button
									color="blue" 
									onClick={(e) => handleViewBtnClick(e, h._id)}
								>
									View
								</Button>
								<DownloadTranscriptButton  
									transcriptTitle={h.title}
									isDisabled={h.type === 'live'}
									transcriptId={h._id}
									/>
								<Button color="red" disabled>Delete</Button>
							</List.Content>
							{
								renderIcon(h)
							}
							<List.Content className={styles.historyItemContent}>
								<List.Header as='p'>
									{/* {h.type === 'live' ? "Live Transcribe on " : "File Upload on "}
									<Moment format="ddd D MMM YYYY, h:mma">{h.createdAt}</Moment>
									{h.input[0].errorCode !== null ? ` (${h.input[0].errorCode})` : ''} */}
									{h.title}
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
				id={styles.listPaginator}
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