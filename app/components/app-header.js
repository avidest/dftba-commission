import React from 'react'
import {Link, LinkContainer} from 'protium/router'
import {
  Navbar,
  Nav,
  NavItem,
  MenuItem,
  NavDropdown,
  Image
} from 'react-bootstrap'

export default function AppHeader(props) {
  let profile = props.profile
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

        {profile && <Nav pullRight>
          <NavDropdown eventKey={1} title={<span>
            <Image src={profile.picture} circle style={{maxWidth: '22px'}} /> {profile.name}
          </span>} id="user-menu">
            <MenuItem eventKey={'user-menu-logout'} onClick={props.handleLogout}>
              Logout
            </MenuItem>
          </NavDropdown>
        </Nav>}
      </Navbar.Collapse>
    </Navbar>
  </div>
}