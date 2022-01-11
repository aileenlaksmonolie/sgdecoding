import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { Dropdown, Icon, Menu } from "semantic-ui-react";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";
import styles from './navbar.module.scss';

const NavBar: React.FC = () => {

	const { name } = useSelector((state: RootState) => state.authReducer);

	const dispatch = useDispatch();
	const { logout } = bindActionCreators(actionCreators, dispatch);


	return (
		<Menu stackable className={styles.noMarginBot}>
			<Menu.Item as={Link} to="/" id={styles.logo}>
				<img src='./images/Main_logo.svg' alt='main logo' width="274"/>
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
						<Dropdown.Item as={Link} to='changename'>Change Name</Dropdown.Item>
						<Dropdown.Item as={Link} to='changepassword'>Change Password</Dropdown.Item>
						<Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>

		</Menu>
	);
};

export default NavBar;