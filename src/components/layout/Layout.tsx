import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";

interface Props {
	children: any;
}


const Layout: React.FC<Props> = ({ children }) => {

	return (
		<div>
			<NavBar />
			<Container>
				{/* TOREFACTOR  */}
				<main> 
					{children}
				</main>
			</Container>
		</div>
	);
}

export default React.memo(Layout)