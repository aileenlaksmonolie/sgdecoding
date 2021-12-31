import React from "react";
import classes from './Layout.module.scss';
import LeftNavBar from "./LeftNavBar";
import NavBar from "./NavBar";

interface Props {
	children: any;
}


const Layout: React.FC<Props> = ({ children }) => {

	return (
		<div className={classes.layout}>
			<NavBar />
			<LeftNavBar> 
				{/* TOREFACTOR  */}
				<main> 
					{children}
				</main>
			</LeftNavBar>
		</div>
	);
}

export default React.memo(Layout)