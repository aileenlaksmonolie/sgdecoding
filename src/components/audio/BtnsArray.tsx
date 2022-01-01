import { Button, Container } from "semantic-ui-react"

interface Props{
	// worker: AudioWorkletNode,
	onStartCb: Function,
	onStopCb: Function,
	// webSocketConn: WebSocket
}


/*
	Input: setRecorder, audioWorklet.postMessage()
	Output: websocketconn, transcriptObj, 
*/

// const BtnsArray: React.FC<Props> = ({worker, onStartCb, onStopCb}) => {
const BtnsArray: React.FC<Props> = ({onStartCb, onStopCb}) => {
	/* */


	/* 
		
	*/

	const onStartClick = () => {
		onStartCb()
	}

	const onStopClick = () => {
		console.log("[DEBUG] BtnArray") 
		// console.log(webSocketConn)
		onStopCb()
	}

	/* */

	// // useEffect(() => {
	// 	// recorder = null
	// }, [webSocketConn])

	return (
		<Container>
			<Button onClick={onStartClick}>Start</Button>
			<Button onClick={onStopClick}>Stop</Button>
			<Button>Redo</Button>
		</Container>
	)
}

export default BtnsArray