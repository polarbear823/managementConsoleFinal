import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
const NavBar = () => {
	return(
		<Navbar>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="/">CommandViz</a>
				</Navbar.Brand>
			</Navbar.Header>
			<Nav>
				<NavItem eventKey={1} href="/list">Alerts</NavItem>
				<NavItem eventKey={2} href="/list">Other</NavItem>
			</Nav>
		</Navbar>
		);
}
export default NavBar;