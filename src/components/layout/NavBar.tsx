import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, Icon, Menu, MenuItemProps } from "semantic-ui-react";
import { RootState } from "../../state/reducers";


const NavBar: React.FC = () => {
	const [activeItem, setActiveItem] = useState('features');

	const { name } = useSelector((state: RootState) => state.authReducer)

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
				{/* <Icon name='user circle' /> */}
				<Dropdown
					trigger={(<span><Icon name='user' />{name}</span>)}
					inline
					item
					icon='caret down'
					text={name}>
					<Dropdown.Menu>
						{/* <Dropdown.Item>Profile</Dropdown.Item>
						<Dropdown.Item>Change Password</Dropdown.Item>
						<Dropdown.Item>Log Out</Dropdown.Item> */}
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>
			{/* <Header as='h4'>
				<Icon name='trophy' />
				<Header.Content>
					Trending repos{' '}
					<Dropdown
						inline
						header='Adjust time span'
					/>
				</Header.Content>
			</Header> */}

		</Menu>
	);
}

export default React.memo(NavBar);