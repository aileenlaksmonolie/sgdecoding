import { useEffect } from "react"
import { Button, Container } from "semantic-ui-react"

interface Props{
	// worker: AudioWorkletNode,
	onStartCb: Function,
	onStopCb: Function
}

// const BtnsArray: React.FC<Props> = ({worker, onStartCb, onStopCb}) => {
const BtnsArray: React.FC<Props> = ({onStartCb, onStopCb}) => {
	/* */


	/* */

	const onStartClick = () => {
		onStartCb()
	}

	const onStopClick = () => {
		onStopCb()
	}

	/* */

	useEffect(() => {
		// recorder = null
	})

	return (
		<Container>
			<Button onClick={onStartClick}>Start</Button>
			<Button onClick={onStopClick}>Stop</Button>
			<Button>Redo</Button>
		</Container>
	)
}

export default BtnsArray