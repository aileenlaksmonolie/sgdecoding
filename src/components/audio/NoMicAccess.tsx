import React from "react";
import { Button, Container } from "semantic-ui-react";

interface Props{
	errorMsg: string
}

const NoMicAccess: React.FC<Props> = ({errorMsg}) => {

	/* */
	const onRefreshPageBtnClick = () => {
		window.location.reload()
	}


	return (
		 <Container textAlign="center">
			 <h2>Request Mic Access Page</h2>
			 <p>baa baa black sheep, we need your permission then x y z</p>
			 <p>{errorMsg}</p>
			<Button color="olive" onClick={onRefreshPageBtnClick}>Refresh Page</Button>
		</Container>
	);
}

export default React.memo(NoMicAccess)