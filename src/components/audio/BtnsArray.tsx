import { useEffect } from "react"
import { Button, Container } from "semantic-ui-react"

interface Props{
	recorder: MediaRecorder,
	onStartCb: Function,
	onStopCb: Function
}

const BtnsArray: React.FC<Props> = ({recorder, onStartCb, onStopCb}) => {
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