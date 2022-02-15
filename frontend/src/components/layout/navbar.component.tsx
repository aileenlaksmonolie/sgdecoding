import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { Button, Dropdown, Icon, Image, Menu, MenuItemProps } from "semantic-ui-react";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './navbar.module.scss';

const NavBar: React.FC = () => {

	const { name } = useSelector((state: RootState) => state.authReducer);

	const dispatch = useDispatch();
	const { toggleSidebar, logout } = bindActionCreators(actionCreators, dispatch);

	const onHamburgerClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps) => {
		console.log("[DEBUG] onHamburgerClick");
		toggleSidebar();
	};

	return (
		<Menu id={styles.menuContainer}>
			<Menu.Item as={Button} id={styles.sidebarBtn} onClick={onHamburgerClick}>
				<Icon name='sidebar' size='large' />
			</Menu.Item>

			<Menu.Item as={Link} to="/" id={styles.logo}>
				<Image src='/images/Main_logo.svg' alt='main logo' width="274" />
			</Menu.Item>

			{/* <Menu.Item
				name='home'
				active={activeItem === 'home'}
				onClick={handleItemClick}
			/>
			<Menu.Item
				name='messages'
				active={activeItem === 'messages'}
				onClick={handleItemClick}
			/> */}

			<Menu.Menu position='right'>
				<Dropdown
					trigger={(<span><Icon name='user' />{name}</span>)}
					inline
					item
					icon='caret down'>
					<Dropdown.Menu>
						<Dropdown.Item as={Link} to='profile'>Profile</Dropdown.Item>
						{/* <Dropdown.Item as={Link} to='changename'>Change Name</Dropdown.Item>
						<Dropdown.Item as={Link} to='changepassword'>Change Password</Dropdown.Item> */}
						<Dropdown.Item onClick={() => logout("We hope to see you again soon!")}>Log Out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>

		</Menu>
	);
};

export default NavBar;