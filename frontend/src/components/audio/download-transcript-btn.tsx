import { useState } from "react";
import { Button } from "semantic-ui-react";
import { getOneTranscriptResult } from "../../api/batch-transcribe-api";

interface Props {
	isDisabled: boolean,
	transcriptTitle: string,
	transcriptId: string,
	children?: any,
	id?: any,
	className?: any,
}


const DownloadTranscriptButton: React.FC<Props> = ({ transcriptTitle, isDisabled, transcriptId, id, className }) => {
	const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);

	const onBtnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		try {
			setIsLoadingTranscript(true);
			const result = await getOneTranscriptResult(transcriptId);

			console.log("[DEBUG] Download Result: ");
			console.log(result);
			const { url } = result.data;

			let anchor = document.createElement('a');
			anchor.style.display = 'none';
			anchor.href = url;
			anchor.download = transcriptTitle.replace(' ', '_') + ".zip";
			document.body.appendChild(anchor);
			anchor.onclick = () => {
				requestAnimationFrame(() => {
					URL.revokeObjectURL(anchor.href);
				});
				document.body.removeChild(anchor);
			} // END anchor.onclick
			setIsLoadingTranscript(false);
			anchor.click();
		} catch (error: any) {
			console.error("[ERROR] Unable to download!")
			console.error({ error })
		}
	}

	return (
		<Button
			id={id ? id : ''}
			loading={isLoadingTranscript}
			icon={isLoadingTranscript ? "spinner" : null} // TODO Continue here
			className={className ? className : ''}
			disabled={isDisabled}
			color="green"
			onClick={onBtnClick}
		>Download</Button>
	);
}

export default DownloadTranscriptButton;