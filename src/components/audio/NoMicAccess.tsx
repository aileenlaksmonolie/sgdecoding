import React from "react";
import { Button, Divider, Grid, Header, Icon, Image, Segment } from "semantic-ui-react";

interface Props {
	errorMsg: string
}

const NoMicAccess: React.FC<Props> = ({ errorMsg }) => {

	/* */
	const onRefreshPageBtnClick = () => {
		window.location.reload()
	}


	return (
		// <Container textAlign="center">
			<div>
				<Segment color="red">
					<Header as='h1'>Mic Access Needed for Live Transcribe</Header>
					<Icon name="microphone slash" size="massive"></Icon>
					<p>{errorMsg ? errorMsg : ''}</p>
					<p>
						To continue, we need your permission to access your microphone to record audio. &nbsp;
						<strong>Please click the "Allow" button</strong> when prompted by browser.&nbsp;
						If it does not appear, you have to manually enable by following the instructions below.
					</p>
					<p>Then, <strong>refresh the page</strong> and you will be able to access Live Transcribe.</p>
					<Button color="olive" onClick={onRefreshPageBtnClick}>Refresh Page</Button>
				</Segment>
				<Segment placeholder>
					<Grid columns={2} stackable textAlign='center'>
						<Divider vertical>Or</Divider>
						<Grid.Row verticalAlign='middle'>
							<Grid.Column>
								<Header icon>Allow Permissions</Header>
								<Image src="/images/AllowPermissions.svg" rounded />
							</Grid.Column>
							<Grid.Column>
								<Header as="h3">If you had previously disallowed permissions...</Header>
								<Image src="/images/PreviouslyDisallowedPermissions.svg" rounded />
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
			</div>
		// </Container>
	);
}

export default React.memo(NoMicAccess)