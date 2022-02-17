import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Container, Icon, Image, Menu, Sidebar } from "semantic-ui-react";
import { useWindowSize } from "../../helpers/window-resize-hook";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './left-nav-bar.module.scss';

interface Props {
	children: any;
}

const LeftNavBar: React.FC<Props> = ({ children }) => {
	const { IS_OPEN } = useSelector((state: RootState) => state.navbarReducer);

	const [visible, setVisible] = useState(false);

	const { pathname } = useLocation();

	const dispatch = useDispatch();
	const { toggleSidebar } = bindActionCreators(actionCreators, dispatch);
	const [width, height] = useWindowSize();

	/**
	 * Open the sidebar if screen resized to > 1200, else hide the sidebar
	 */
	useEffect(() => {
		if((width < 1200 && IS_OPEN) || (width >= 1200 && !IS_OPEN))
			toggleSidebar();
	}, [width, height]);

	/**
	 * Display/hide the sidebar when toggled
	 */
	useEffect(() => {
		setVisible(IS_OPEN);
	}, [IS_OPEN]);

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
				id={styles.sidebar}
			>
				<Menu.Item
					as={Link}
					to="/"
					active={pathname === '/'}
					className={pathname === '/' ? styles.active : ''}
				>
					<Icon name='home' />
					Overview
				</Menu.Item>

				<Menu.Item
					as={Link}
					to="/viewalljobs"
					active={pathname === '/viewalljobs'}
					className={pathname === '/viewalljobs' ? styles.active : ''}
				>
					<Icon name='list layout' />
					View All Jobs
				</Menu.Item>

				<Menu.Item
					as={Link}
					to="/livetranscribe"
					active={pathname === '/livetranscribe'}
					className={pathname === '/livetranscribe' ? styles.active : ''}
				>
					<Icon name='microphone' />
					Live Transcribe
				</Menu.Item>

				<Menu.Item
					as={Link}
					to="/offlinetranscribe"
					active={pathname === '/offlinetranscribe'}
					className={pathname === '/offlinetranscribe' ? styles.active : ''}
				>
					<Icon name='file audio' />
					Offline Transcribe
				</Menu.Item>


				<Menu.Item id={styles.ackCont}>
					{/* <Grid>
						<Grid.Row>
							<Grid.Column> */}
					<div id={styles.ack}>
						<p>A joint-project in collaboration between</p>
						<Image as="a" href="https://www.ntu.edu.sg/" src="/images/logo_col_ntu.svg" alt="" />
						<Image as="a" href="https://www.nus.edu.sg/" src="/images/logo_col_nus.svg" alt="" />
						<Image as="a" href="https://aisingapore.org/" src="/images/logo_col_ai_sg.svg" alt="" />
						<Image as="a" href="https://www.abax.ai/" src="/images/logo_col_abax.svg" alt="" />
					</div>
					{/* </Grid.Column>
							<Grid.Column> */}
					{/* </Grid.Column>
						</Grid.Row>

						<Grid.Row>
							<Grid.Column> */}
					{/* </Grid.Column>
							<Grid.Column> */}
					{/* </Grid.Column>
						</Grid.Row>
					</Grid> */}
				</Menu.Item>
			</Sidebar>

			<Sidebar.Pusher id={styles.pusherContainer}>
				<Container id={styles.mainContentContainer}>
					{children}
				</Container>
			</Sidebar.Pusher>
		</Sidebar.Pushable>

	);
};

export default LeftNavBar;