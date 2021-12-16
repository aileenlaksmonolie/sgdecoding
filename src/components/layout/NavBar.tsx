import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { Dropdown, Icon, Menu, MenuItemProps } from "semantic-ui-react";
import { actionCreators } from "../../state";
import { RootState } from "../../state/reducers";

const NavBar: React.FC = () => {
	const [activeItem, setActiveItem] = useState('features');

	const { name } = useSelector((state: RootState) => state.authReducer)

	const dispatch = useDispatch()
	const { logout } = bindActionCreators(actionCreators, dispatch)


	const handleItemClick =
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
			{ name }: MenuItemProps) => {
			return setActiveItem(name!)
		}

	return (
		<Menu stackable>
			<Menu.Item>
				{/* TODO */}
				<img src='https://react.semantic-ui.com/logo.png' />
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
						<Dropdown.Item as={Link} to='changepassword'>Change Password</Dropdown.Item>
						<Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>

		</Menu>
	);
}

export default React.memo(NavBar);