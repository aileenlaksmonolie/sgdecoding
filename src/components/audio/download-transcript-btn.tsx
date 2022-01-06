import { Button } from "semantic-ui-react";

interface Props {
	children?: any
}

const DownloadTranscriptButton: React.FC<Props> = () => {

	return (
		<Button color="green">Download</Button>
	);
}

export default DownloadTranscriptButton;