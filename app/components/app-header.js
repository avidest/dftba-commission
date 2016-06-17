import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  NavDropdown,
  Grid,
  Row,
  Col
} from 'react-bootstrap'

export default function AppHeader(props) {
  return <div>
    <Navbar inverse staticTop className="dftba">
      <Navbar.Header>
        <Navbar.Brand className="dftba-brand">
          <Link to="/dashboard">DFTBA</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>

      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/users">
            <NavItem eventKey={1}>Users</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
}