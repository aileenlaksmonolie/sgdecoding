import React from "react";
import { Link } from "react-router-dom";
import { Container, Icon, Menu, Sidebar } from "semantic-ui-react";
import styles from './LeftNavBar.module.scss';

interface Props {
	children: any;
}

const LeftNavBar: React.FC<Props> = ({ children }) => {
	const [visible, setVisible] = React.useState(true)

	return (
		// TODO Add Hamburger button
		// and make it pushable
		<Sidebar.Pushable id={styles.sidebarContainer}>
			<Sidebar
				as={Menu}
				animation='overlay'
				icon='labeled'
				// onHide={() => setVisible(false)}
				vertical
				visible={visible}
				// width='wide'
				className={styles.sidebar}
			>
				<Menu.Item as={Link} to="/" >
					<Icon name='home' />
					Overview
				</Menu.Item>

				<Menu.Item as={Link} to="/livetranscribe">
					<Icon name='microphone' />
					Live Transcribe
				</Menu.Item>

				<Menu.Item as={Link} to="/offlinetranscribe">
					<Icon name='file audio' />
					Offlive Transcribe
				</Menu.Item>

			</Sidebar>

			<Sidebar.Pusher id={styles.pusherContainer}>
				<Container>
					{children}
				</Container>
			</Sidebar.Pusher>
		</Sidebar.Pushable>

	);
}

export default React.memo(LeftNavBar)